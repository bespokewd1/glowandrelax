import satori from 'satori';
import sharp from 'sharp';
import client from '@data/clientData';
import { brandAssets, OG_WIDTH, OG_HEIGHT, type OgCard } from './seo';

export async function renderOgImage(card: OgCard) {
  if (card.override) {
    // Preserve all text on complete uploaded cards, padding instead of cropping.
    return sharp(card.photo)
      .rotate()
      .resize(OG_WIDTH, OG_HEIGHT, {
        fit: 'contain',
        background: '#faf6ea',
      })
      .png()
      .toBuffer();
  }
  const assets = await brandAssets;
  const photo = await sharp(card.photo)
    .rotate()
    .resize(520, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 90 })
    .toBuffer();
  const logo = await sharp(assets.logo)
    .resize(94, 94, { fit: 'inside' })
    .png()
    .toBuffer();
  const headline = card.headline;
  const fontSize = headline.length > 40 ? 52 : headline.length > 28 ? 60 : 68;
  const svg = await satori(
    <div
      style={{
        display: 'flex',
        width: OG_WIDTH,
        height: OG_HEIGHT,
        background: '#faf6ea',
        color: '#30352f',
        fontFamily: 'Mona Sans',
        position: 'relative',
      }}
    >
      <img
        src={`data:image/jpeg;base64,${photo.toString('base64')}`}
        width={520}
        height={630}
        style={{ position: 'absolute', right: 0, top: 0 }}
      />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          right: 32,
          top: 32,
          bottom: 32,
          width: 456,
          border: '1px solid rgba(250,246,234,0.65)',
        }}
      />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 700,
          height: 630,
          boxSizing: 'border-box',
          background: '#faf6ea',
          padding: '38px 54px 38px 54px',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', height: 78 }}>
          <img
            src={`data:image/png;base64,${logo.toString('base64')}`}
            width={72}
            height={72}
          />
          <div
            style={{ display: 'flex', flexDirection: 'column', marginLeft: 18 }}
          >
            <div
              style={{ fontFamily: 'Fraunces', fontSize: 31, color: '#435b47' }}
            >
              {client.name}
            </div>
            <div
              style={{
                fontSize: 14,
                letterSpacing: 3,
                marginTop: 5,
                color: '#734c52',
                textTransform: 'uppercase',
              }}
            >
              {client.address.city}, Alberta
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            height: 1,
            width: 86,
            background: '#a87579',
            marginTop: 25,
            marginBottom: 26,
          }}
        />
        <div
          style={{
            display: 'flex',
            color: '#734c52',
            textTransform: 'uppercase',
            letterSpacing: 3,
            fontSize: 15,
          }}
        >
          {card.label}
        </div>
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: 14,
            paddingBottom: 14,
          }}
        >
          <div
            style={{
              fontFamily: 'Fraunces',
              fontSize,
              lineHeight: 1.08,
              letterSpacing: -1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            {headline}
          </div>
          <div
            style={{
              fontSize: 23,
              lineHeight: 1.4,
              color: '#4b5148',
              marginTop: 22,
              maxWidth: 560,
            }}
          >
            {card.detail}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #d4d7cb',
            paddingTop: 21,
            marginTop: 8,
          }}
        >
          <div style={{ display: 'flex', color: '#435b47', fontSize: 19 }}>
            {card.action}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              style={{ marginLeft: 12 }}
            >
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                fill="none"
                stroke="#435b47"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div style={{ fontSize: 14, color: '#5d6458' }}>
            {new URL(client.domain).hostname}
          </div>
        </div>
      </div>
    </div>,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        { name: 'Fraunces', data: assets.serif, weight: 400, style: 'normal' },
        { name: 'Mona Sans', data: assets.sans, weight: 400, style: 'normal' },
      ],
    }
  );
  return sharp(Buffer.from(svg)).png().toBuffer();
}
