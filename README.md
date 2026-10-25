# Chaima Oppas Landing Page

Statische landingpage voor Oppas by Chaima.

## Bestanden

- `index.html` - semantische pagina-opbouw en SEO metadata
- `style.css` - responsive styling en animaties
- `script.js` - scroll reveal, FAQ, mobiele navigatie en WhatsApp intake-links
- `assets/` - beeldmateriaal en favicon

## WhatsApp nummer wijzigen

Open `script.js` en wijzig:

```js
const whatsappNumber = "31648703092";
```

Gebruik het internationale formaat zonder `+` en zonder eerste `0`.

## GitHub Pages

Deze map kan direct als repo naar GitHub. Zet daarna GitHub Pages aan via:

`Settings > Pages > Deploy from branch > main > /root`

## Diensten en taalroutes

- Nederlands: `/` en `/diensten/`
- Engels: `/en/` en `/en/services/`
- Frans: `/fr/` en `/fr/services/`

Alle pagina's delen `style.css` en `script.js`. De dienstenpagina's hergebruiken de FAQ-accordion, het afsluitende contactblok en de footer van de homepage. De taalwissel behoudt het paginatype.

Dienstgerichte aanvragen staan op links met `data-service`; JavaScript voegt de categorie toe aan het WhatsApp-bericht. Zonder JavaScript blijft de WhatsApp-link bruikbaar. Er is geen automatisch boekings- of bevestigingssysteem. Chaima bevestigt uren, tarief, reisafspraken en annulering persoonlijk vóór de afspraak.

De illustratie voor diensten is `assets/hero-diensten.webp` (864 × 654, transparant). Houd `width` en `height` in HTML gelijk aan de afmetingen van de afbeelding. Werk bij inhoudelijke routewijzigingen ook canonicals, hreflang en `sitemap.xml` bij.

## Lokale review

Start `python3 -m http.server 8766` vanuit de projectmap. Publiceren via een push naar `main` activeert GitHub Pages; doe dit pas na expliciet akkoord op de review.
