import RobotHumanoid3D from "@/components/RobotHumanoid3D";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <RobotHumanoid3D />

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center">
        <h1 className="text-5xl font-bold text-black/80">
          Noxdra AI — Humanoid Assistant
        </h1>
      </div>
    </main>
  );
}
