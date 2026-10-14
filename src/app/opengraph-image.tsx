import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Wellflexia homepage with its patient list mobile experience';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const runtime = 'nodejs';

export default async function OpenGraphImage() {
  const [patientList, montserratRegular, montserratBold] = await Promise.all([
    readFile(join(process.cwd(), 'public/images/mobile-patient-list-og.png')),
    readFile(join(process.cwd(), 'public/fonts/montserrat-latin-400.ttf')),
    readFile(join(process.cwd(), 'public/fonts/montserrat-latin-700.ttf')),
  ]);
  const patientListSrc = `data:image/png;base64,${patientList.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#FAFAF8',
          color: '#14231A',
          fontFamily: 'Montserrat',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 76,
            flexShrink: 0,
            padding: '0 64px',
            borderBottom: '1px solid #E8E6E0',
            backgroundColor: '#FAFAF8',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 26,
              fontWeight: 700,
              fontStyle: 'italic',
              letterSpacing: '-0.52px',
            }}
          >
            <span>well</span>
            <span
              style={{
                color: '#1D9E75',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(29,158,117,0.3)',
                textUnderlineOffset: 5,
              }}
            >
              flex
            </span>
            <span>ia !</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            position: 'relative',
            flex: 1,
            overflow: 'hidden',
            backgroundColor: '#0C1A12',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              left: -75,
              top: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(29,158,117,0.2), transparent 70%)',
            }}
          />
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              right: -95,
              bottom: -140,
              width: 360,
              height: 360,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(93,202,165,0.14), transparent 70%)',
            }}
          />

          <div
            style={{
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '28px 58px 25px 66px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 660,
                height: '100%',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  gap: 10,
                  marginBottom: 17,
                  padding: '8px 14px',
                  border: '1px solid rgba(29,158,117,0.25)',
                  borderRadius: 999,
                  backgroundColor: 'rgba(29,158,117,0.1)',
                  color: '#5DCAA5',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#1D9E75',
                  }}
                />
                Hospital operations, unified
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: 46,
                  fontWeight: 700,
                  lineHeight: 1.12,
                  letterSpacing: '-1.5px',
                }}
              >
                <span>Every visit, every vital,</span>
                <span>
                  <span style={{ color: '#5DCAA5', fontStyle: 'italic' }}>one system.</span>
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  width: 630,
                  marginTop: 15,
                  color: '#8FA89A',
                  fontSize: 15,
                  fontWeight: 500,
                  lineHeight: 1.55,
                }}
              >
                Patient records, visits, theatre scheduling, billing, and compliance — running as connected services instead of a pile of spreadsheets and side channels.
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 20,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 155,
                    height: 46,
                    borderRadius: 999,
                    backgroundColor: '#1D9E75',
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  Sign in&nbsp; →
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 242,
                    height: 46,
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Request guest access&nbsp; ↗
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 20,
                }}
              >
                {[
                  '5 connected services',
                  '8 hospital roles',
                  'Guest access, fully governed',
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 999,
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 365,
                height: 520,
                flexShrink: 0,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 28,
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
                boxShadow: 'inset 0 0 0 1px rgba(29,158,117,0.05)',
              }}
            >
              <img
                src={patientListSrc}
                alt="Wellflexia mobile patient list screen"
                width={337}
                height={505}
                style={{
                  display: 'flex',
                  width: 337,
                  height: 505,
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Montserrat',
          data: montserratRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Montserrat',
          data: montserratBold,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );
}
