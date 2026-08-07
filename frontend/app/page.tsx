import { Send, Sparkles } from "lucide-react";
const stats = [
  { label: "Revenue", value: "€0", change: "No data yet" },
  { label: "Tasks", value: "0", change: "Nothing pending" },
  { label: "Alerts", value: "0", change: "Everything is clear" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              NEXORA
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Intelligent Business Operating System
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium">
            Y
          </div>
        </header>

        {/* Welcome */}
        <section className="mt-14">
          <p className="text-sm text-zinc-500">Good morning</p>

          <h2 className="mt-2 text-4xl font-semibold tracking-tight">
            Welcome to Nexora.
          </h2>

          <p className="mt-3 max-w-xl text-zinc-400">
            Your business intelligence is ready. Let's build something great.
          </p>
        </section>

        {/* Stats */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <p className="text-sm text-zinc-500">{stat.label}</p>

              <p className="mt-3 text-3xl font-semibold">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                {stat.change}
              </p>
            </div>
          ))}
        </section>

        {/* AI Assistant */}
<section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">

  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
      <Sparkles size={20} className="text-purple-400" />
    </div>

    <div>
      <p className="font-medium">
        Nexora Intelligence
      </p>
      <p className="text-xs text-zinc-500">
        Your business AI partner
      </p>
    </div>
  </div>

  <div className="mt-6 rounded-xl bg-zinc-950 p-4">
    <p className="text-sm text-zinc-400">
      Bonjour Yvon 👋
    </p>

    <p className="mt-2 text-sm">
      Je suis Nexora. Je suis prête à apprendre votre entreprise.
    </p>
  </div>

  <div className="mt-4 flex gap-3">

    <input
      type="text"
      placeholder="Demandez quelque chose à Nexora..."
      className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-600"
    />

    <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black">
      <Send size={16}/>
      Envoyer
    </button>

  </div>

</section>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-zinc-700">
          Nexora · Building the future of intelligent business
        </footer>

      </div>
    </main>
  );
}