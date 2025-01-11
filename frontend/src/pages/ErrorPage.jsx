import Logo from "../components/Logo";

export default function ErrorPage() {
  return (
    <div>
      <div className="shadow-md h-20 display flex place-items-center justify-center gap-4">
        <Logo />
        <h1 className="border font-sans text-3xl">Error Page</h1>
      </div>
    </div>
  );
}
