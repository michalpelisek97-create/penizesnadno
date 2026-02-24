import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { days = 7 } = await req.json().catch(() => ({}));

    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    const events = await base44.asServiceRole.entities.AdEvent.filter(
      { date: { $gte: sinceStr } },
      'date',
      5000
    );

    // Seskup po dnech
    const byDay = {};
    for (const ev of events) {
      const d = ev.date;
      if (!byDay[d]) byDay[d] = { impressions: 0, clicks: 0 };
      if (ev.event_type === 'impression') byDay[d].impressions++;
      if (ev.event_type === 'click') byDay[d].clicks++;
    }

    // Vytvoř pole pro posledních N dní (i prázdné)
    const CPM = 0.80;
    const chartData = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
      const imp = byDay[key]?.impressions || 0;
      const clk = byDay[key]?.clicks || 0;
      chartData.push({
        day: label,
        date: key,
        zobrazení: imp,
        kliknutí: clk,
        CTR: imp > 0 ? ((clk / imp) * 100).toFixed(2) : '0.00',
        příjmy: ((imp / 1000) * CPM).toFixed(2)
      });
    }

    const totalImpressions = events.filter(e => e.event_type === 'impression').length;
    const totalClicks = events.filter(e => e.event_type === 'click').length;
    const totalRevenue = ((totalImpressions / 1000) * CPM).toFixed(2);
    const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

    return Response.json({ chartData, totalImpressions, totalClicks, totalRevenue, avgCTR });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});