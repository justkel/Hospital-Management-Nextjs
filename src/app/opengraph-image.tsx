import { ImageResponse } from 'next/og';

export const alt = 'Wellflexia — connected hospital care, from patient records to billing';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#0C1A12',
          color: '#FFFFFF',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.2,
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -180,
            right: -40,
            width: 620,
            height: 620,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(29,158,117,0.3), rgba(12,26,18,0) 70%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '58px 70px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 700, fontStyle: 'italic', letterSpacing: '-1.5px' }}>
            <span>well</span>
            <span style={{ color: '#5DCAA5' }}>flex</span>
            <span>ia !</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 54 }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: 640 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, color: '#5DCAA5', fontSize: 17, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#1D9E75' }} />
                Healthcare, connected
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: 62, lineHeight: 1.08, fontWeight: 700, letterSpacing: '-2px' }}>
                <span>Every visit.</span>
                <span>Every vital.</span>
                <span style={{ color: '#5DCAA5', fontStyle: 'italic' }}>One system.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 24, color: '#A9B9AE', fontSize: 21, lineHeight: 1.45 }}>
                <span>Patient records, clinical workflows, billing,</span>
                <span>and hospital operations in one place.</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: 340, padding: 22, borderRadius: 24, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ display: 'flex', width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#1D9E75', color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>W</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>Care workspace</span>
                  <span style={{ color: '#91A99B', fontSize: 12 }}>A clearer view of every visit</span>
                </div>
              </div>
              {[
                ['01', 'Patient record'],
                ['02', 'Clinical assessment'],
                ['03', 'Connected care'],
                ['04', 'Visit & billing'],
              ].map(([number, label]) => (
                <div key={number} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '16px 4px', borderBottom: number === '04' ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ display: 'flex', width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(29,158,117,0.18)', color: '#5DCAA5', fontSize: 12, fontWeight: 700 }}>{number}</span>
                  <span style={{ color: '#E7EEE9', fontSize: 15, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#789083', fontSize: 14, letterSpacing: '0.5px' }}>
            <span>WELLFLEXIA.COM</span>
            <span>Hospital management, thoughtfully connected.</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
