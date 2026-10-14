import Link from 'next/link';

export default function WellflexiaHeader() {
  return (
    <div className="mb-8 flex items-center lg:hidden">
      <Link
        href="/"
        aria-label="Wellflexia home"
        className="text-[19px] font-bold italic tracking-[-0.02em] !text-[#14231A]"
      >
        well<span className="!text-[#1D9E75] underline decoration-[#1D9E75]/30 underline-offset-4">flex</span>ia !
      </Link>
    </div>
  );
}
