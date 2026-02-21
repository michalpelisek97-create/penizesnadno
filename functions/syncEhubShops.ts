import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const apiKey = Deno.env.get('EHUB_API_KEY');
    const partnerId = Deno.env.get('EHUB_PARTNER_ID');

    if (!apiKey || !partnerId) {
      return Response.json({ error: 'Missing API credentials' }, { status: 500 });
    }

    // Fetch campaigns from eHUB API
    const apiUrl = `https://api.ehub.cz/v3/publishers/${partnerId}/campaigns?apiKey=${apiKey}`;
    console.log('API URL:', apiUrl.replace(apiKey, '***'));
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('API error response:', errorText);
      throw new Error(`eHUB API error: ${response.status} - ${errorText}`);
    }

    const textData = await response.text();
    console.log('eHUB API raw response:', textData);
    const data = JSON.parse(textData);
    console.log('eHUB API response:', JSON.stringify(data, null, 2));
    const campaigns = Array.isArray(data) ? data : data.data || [];
    console.log('Campaigns parsed:', campaigns.length);

    // Get existing shops from "Nákup levně" category
    const existingShops = await base44.asServiceRole.entities.ReferralLink.filter({
      categories: 'Nákup levně',
      is_article: false
    }, '-created_date', 1000);

    const existingTitles = new Set(existingShops.map(s => s.title));

    // Transform and save campaigns
    let createdCount = 0;
    for (const campaign of campaigns) {
      if (!campaign.name || existingTitles.has(campaign.name)) {
        continue;
      }

      try {
        await base44.asServiceRole.entities.ReferralLink.create({
          title: campaign.name,
          description: campaign.description || '',
          url: campaign.trackingUrl || campaign.url || '',
          image_url: campaign.bannerUrl || '',
          categories: ['Nákup levně'],
          category: 'Nákup levně',
          cta_text: 'Přejít na obchod',
          is_active: true,
          is_article: false,
          sort_order: 0
        });
        createdCount++;
      } catch (e) {
        console.error(`Failed to create campaign ${campaign.name}:`, e.message);
      }
    }

    return Response.json({
      success: true,
      message: `Synchronizováno ${createdCount} nových obchodů`,
      total: campaigns.length
    });
  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});