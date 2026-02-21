import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const data = await base44.asServiceRole.entities.ReferralLink.filter(
      { is_active: true },
      'sort_order',
      30
    );

    const slimmed = data.map(({ content, ...rest }) => rest);

    return Response.json({ data: slimmed });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});