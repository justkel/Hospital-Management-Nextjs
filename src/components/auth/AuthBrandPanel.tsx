export default function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden !bg-[#0C1A12] px-10 py-12 font-sans lg:flex xl:px-14">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,700&display=swap');
        .font-sans { font-family: 'Montserrat', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full !bg-[#1D9E75]/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full !bg-[#5DCAA5]/10 blur-[100px]" />

      <div className="relative flex items-center gap-3">
        <span className="text-[22px] font-bold italic tracking-[-0.02em] !text-white xl:text-[24px]">
          well<span className="!text-[#1D9E75] underline decoration-[#1D9E75]/30 underline-offset-4">flex</span>ia !
        </span>
      </div>

      <div className="relative flex-1 flex flex-col justify-center py-12">
        <span className="pointer-events-none absolute -top-2 -left-2 select-none text-[96px] font-extrabold leading-none tracking-[-0.04em] !text-white/[0.06]">
          24/7
        </span>

        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border !border-[#1D9E75]/25 !bg-[#1D9E75]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] !text-[#5DCAA5]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full !bg-[#1D9E75]" />
          Healthcare reimagined
        </div>

        <h1 className="mb-5 text-[36px] font-extrabold leading-[1.1] tracking-[-0.02em] !text-white xl:text-[40px]">
          One platform.<br />
          <span className="italic !text-[#5DCAA5]">Every patient.</span><br />
          Every workflow.
        </h1>

        <p className="mb-10 max-w-sm text-[13px] font-medium leading-[1.75] !text-[#8fa89a]">
          Built for clinicians who move fast. Manage records, billing, staff, and procedures without switching tools.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { val: '24/7', label: 'Access' },
            { val: 'Secure', label: 'Patient Records' },
            { val: 'Fast', label: 'Workflow' },
          ].map(m => (
            <div key={m.label} className="rounded-xl border !border-white/[0.07] !bg-white/[0.04] px-4 py-3.5">
              <p className="text-[20px] font-extrabold leading-none !text-white">{m.val}</p>
              <p className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.06em] !text-[#3B6D11]">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex items-center justify-between border-t !border-white/[0.06] pt-5">
        <span className="text-[11px] font-medium !text-[#1f3328]">© {new Date().getFullYear()} wellflexia!</span>
        <div className="inline-flex items-center gap-1.5 rounded-full border !border-[#1D9E75]/25 !bg-[#1D9E75]/12 px-2.5 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full !bg-[#1D9E75]" />
          <span className="text-[11px] font-bold !text-[#1D9E75]">All systems live</span>
        </div>
      </div>
    </div>
  );
}