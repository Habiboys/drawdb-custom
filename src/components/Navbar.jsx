import { IconMenu } from "@douyinfe/semi-icons";
import { SideSheet } from "@douyinfe/semi-ui";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_light_160.png";
import { socials } from "../data/socials";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-4">
          <div className="flex items-center gap-10">
            <Link to="/" className="shrink-0">
              <img src={logo} alt="logo" className="h-10 sm:h-8" />
            </Link>

            <div className="md:hidden flex items-center gap-7 text-sm font-medium text-zinc-600">
              <button
                type="button"
                className="transition-colors hover:text-zinc-900"
                onClick={() =>
                  document
                    .getElementById("features")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Features
              </button>
              <Link
                to="/templates"
                className="transition-colors hover:text-zinc-900"
              >
                Templates
              </Link>
              <a
                href={socials.docs}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-zinc-900"
              >
                Docs
              </a>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <a
              title="Jump to Github"
              className="rounded-full px-2 py-2 text-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
              href={socials.github}
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-github" />
            </a>
            <a
              title="Follow us on X"
              className="rounded-full px-2 py-2 text-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
              href={socials.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-twitter-x" />
            </a>
            <Link
              to="/editor"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Open editor
            </Link>
          </div>

          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700"
          >
            <IconMenu size="extra-large" />
          </button>
        </div>
      </div>

      <SideSheet
        title={<img src={logo} alt="logo" className="h-9" />}
        visible={openMenu}
        onCancel={() => setOpenMenu(false)}
        width={window.innerWidth}
      >
        <button
          type="button"
          className="block w-full rounded-lg p-3 text-left text-base font-medium text-zinc-700 hover:bg-zinc-100"
          onClick={() => {
            document
              .getElementById("features")
              .scrollIntoView({ behavior: "smooth" });
            setOpenMenu(false);
          }}
        >
          Features
        </button>

        <Link
          to="/editor"
          className="block rounded-lg p-3 text-base font-medium text-zinc-700 hover:bg-zinc-100"
          onClick={() => setOpenMenu(false)}
        >
          Editor
        </Link>

        <Link
          to="/templates"
          className="block rounded-lg p-3 text-base font-medium text-zinc-700 hover:bg-zinc-100"
          onClick={() => setOpenMenu(false)}
        >
          Templates
        </Link>

        <a
          href={socials.docs}
          target="_blank"
          rel="noreferrer"
          className="block rounded-lg p-3 text-base font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Docs
        </a>
      </SideSheet>
    </>
  );
}
