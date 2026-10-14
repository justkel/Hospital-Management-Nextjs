import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Wellflexia hospital management system patient management screen';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const runtime = 'nodejs';

export default async function OpenGraphImage() {
  const patientList = await readFile(
    join(process.cwd(), 'public/images/mobile-patient-list-og.png'),
  );
  const patientListSrc = `data:image/png;base64,${patientList.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: 'linear-gradient(118deg, #0C1A12 0%, #10281D 58%, #173B2D 100%)',
          color: '#FFFFFF',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            right: -140,
            top: -250,
            width: 720,
            height: 720,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(93,202,165,0.18), rgba(12,26,18,0) 70%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            inset: 0,
            opacity: 0.12,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.32) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div
          style={{
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '40px 66px 38px 72px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', width: 570, height: '100%', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 31, fontWeight: 700, fontStyle: 'italic', letterSpacing: '-1.2px' }}>
              <span>well</span>
              <span style={{ color: '#5DCAA5' }}>flex</span>
              <span>ia !</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 15 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, color: '#75D7B5', fontSize: 13, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
                <span style={{ display: 'flex', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#5DCAA5' }} />
                Hospital management system
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: 52, lineHeight: 1.08, fontWeight: 700, letterSpacing: '-2px' }}>
                <span>Care starts</span>
                <span>with a clearer</span>
                <span style={{ color: '#75D7B5', fontStyle: 'italic' }}>patient view.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 22, color: '#B1C0B6', fontSize: 17, lineHeight: 1.5 }}>
                <span>Connect patient records and hospital</span>
                <span>workflows in one secure platform.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 24 }}>
                <span style={{ display: 'flex', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#5DCAA5' }} />
                <span style={{ color: '#D0DFD5', fontSize: 13, fontWeight: 600 }}>Records · visits · wards · billing</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', color: '#789083', fontSize: 12, letterSpacing: '0.5px' }}>
              WELLFLEXIA.COM
            </div>
          </div>

          <div style={{ display: 'flex', position: 'relative', width: 430, height: 580, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', position: 'absolute', right: 10, top: 24, width: 330, height: 520, borderRadius: 35, background: 'rgba(93,202,165,0.15)', transform: 'rotate(4deg)' }} />
            <img
              src={patientListSrc}
              alt="Wellflexia mobile patient list screen"
              width={385}
              height={578}
              style={{
                display: 'flex',
                position: 'relative',
                width: 385,
                height: 578,
                objectFit: 'contain',
              }}
            />
            <div style={{ display: 'flex', position: 'absolute', right: -12, bottom: 38, alignItems: 'center', gap: 9, padding: '12px 15px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, backgroundColor: '#173B2D', boxShadow: '0 12px 28px rgba(0,0,0,0.24)' }}>
              <div style={{ display: 'flex', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: '#1D9E75', color: '#FFFFFF', fontSize: 12, fontWeight: 700 }}>01</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 700 }}>Patient records</span>
                <span style={{ color: '#A9B9AE', fontSize: 8 }}>A connected care journey</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
