import { useState, useCallback, useEffect, useMemo, useRef } from "react";

function App() {
  const [length, setLength] = useState(16);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [specialChars, setSpecialChars] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const passwordRef = useRef(null);

  const strength = useMemo(() => {
    let score = 0;
    if (length >= 10) score += 1;
    if (length >= 16) score += 1;
    if (numberAllowed) score += 1;
    if (specialChars) score += 1;

    if (score <= 1) {
      return {
        label: "Basic",
        width: "w-1/4",
        color: "bg-rose-500",
        text: "text-rose-200",
      };
    }

    if (score <= 3) {
      return {
        label: "Strong",
        width: "w-3/4",
        color: "bg-amber-400",
        text: "text-amber-100",
      };
    }

    return {
      label: "Excellent",
      width: "w-full",
      color: "bg-emerald-400",
      text: "text-emerald-100",
    };
  }, [length, numberAllowed, specialChars]);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numberAllowed) str += "0123456789";
    if (specialChars) str += "!@#$%^&*-_+=[]{}~`";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    setPassword(pass);
    setCopied(false);
  }, [length, numberAllowed, specialChars, setPassword]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, password.length);
    window.navigator.clipboard.writeText(password);
    setCopied(true);
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, specialChars, passwordGenerator]);

  return (
    <main className="min-h-screen bg-[#101820] px-5 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-sm font-medium text-teal-100">
            Private by design
          </div>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-semibold tracking-normal text-white sm:text-5xl">
              Password Generator
            </h1>
            <p className="max-w-lg text-base leading-7 text-slate-300">
              Create crisp, high-entropy passwords with readable controls and
              instant copy support.
            </p>
          </div>
          <div className="grid max-w-lg grid-cols-3 gap-3 text-sm">
            <div className="border-l border-white/15 pl-4">
              <p className="text-2xl font-semibold text-white">{length}</p>
              <p className="text-slate-400">Characters</p>
            </div>
            <div className="border-l border-white/15 pl-4">
              <p className="text-2xl font-semibold text-white">
                {numberAllowed ? "On" : "Off"}
              </p>
              <p className="text-slate-400">Numbers</p>
            </div>
            <div className="border-l border-white/15 pl-4">
              <p className="text-2xl font-semibold text-white">
                {specialChars ? "On" : "Off"}
              </p>
              <p className="text-slate-400">Symbols</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-200">
                Generated password
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Ready to copy
              </h2>
            </div>
            <button
              className="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-teal-200/40 hover:bg-teal-300/15 focus:outline-none focus:ring-2 focus:ring-teal-300"
              onClick={passwordGenerator}
              type="button"
            >
              Regenerate
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0b1117]">
            <div className="flex flex-col sm:flex-row">
              <input
                type="text"
                value={password}
                className="min-h-16 w-full bg-transparent px-4 py-4 font-mono text-lg text-white outline-none sm:text-xl"
                placeholder="password"
                readOnly={true}
                ref={passwordRef}
              />
              <button
                className="shrink-0 bg-teal-300 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={copyPasswordToClipboard}
                type="button"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-white/10 bg-slate-950/30 p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-300">
                Password strength
              </span>
              <span className={`text-sm font-semibold ${strength.text}`}>
                {strength.label}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${strength.width} ${strength.color} transition-all duration-300`}
              />
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <label
                  className="text-sm font-medium text-slate-200"
                  htmlFor="lengthInput"
                >
                  Length
                </label>
                <span className="rounded-md bg-white/10 px-3 py-1 font-mono text-sm text-white">
                  {length}
                </span>
              </div>
              <input
                type="range"
                min={6}
                max={64}
                value={length}
                id="lengthInput"
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-teal-300"
                onChange={(e) => {
                  setLength(Number(e.target.value));
                }}
              />
            </div>

            <label
              className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4 transition hover:border-teal-200/30 hover:bg-teal-300/10"
              htmlFor="numberInput"
            >
              <span>
                <span className="block font-medium text-white">Numbers</span>
                <span className="text-sm text-slate-400">
                  Include digits from 0 through 9.
                </span>
              </span>
              <span className="relative inline-flex h-7 w-12 items-center">
                <input
                  type="checkbox"
                  checked={numberAllowed}
                  id="numberInput"
                  className="peer sr-only"
                  onChange={() => {
                    setNumberAllowed((prev) => !prev);
                  }}
                />
                <span className="absolute inset-0 rounded-full bg-slate-700 transition peer-checked:bg-teal-300" />
                <span className="absolute left-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
              </span>
            </label>

            <label
              className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4 transition hover:border-teal-200/30 hover:bg-teal-300/10"
              htmlFor="characterInput"
            >
              <span>
                <span className="block font-medium text-white">Symbols</span>
                <span className="text-sm text-slate-400">
                  Add special characters for more entropy.
                </span>
              </span>
              <span className="relative inline-flex h-7 w-12 items-center">
                <input
                  type="checkbox"
                  checked={specialChars}
                  id="characterInput"
                  className="peer sr-only"
                  onChange={() => {
                    setSpecialChars((prev) => !prev);
                  }}
                />
                <span className="absolute inset-0 rounded-full bg-slate-700 transition peer-checked:bg-teal-300" />
                <span className="absolute left-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
              </span>
            </label>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
