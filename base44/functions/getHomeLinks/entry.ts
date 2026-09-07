import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        const data = await base44.asServiceRole.entities.ReferralLink.filter(
            { is_active: true },
            'sort_order',
            50
        );

        // Vrátíme POUZE pole potřebná pro Home stránku - bez content (HTML články)
        const slim = data.map(({ id, title, description, url, image_url, categories, category, is_article, sort_order, is_active }) => ({
            id,
            title,
            url,
            image_url,
            categories,
            category,
            is_article,
            sort_order,
            is_active,
            description: description ? description.substring(0, 100) : null,
        }));

        return Response.json(slim);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});