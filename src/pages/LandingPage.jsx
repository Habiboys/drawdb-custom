import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tweet } from "react-tweet";
import FadeIn from "../animations/FadeIn";
import discord from "../assets/discord.png";
import github from "../assets/github.png";
import mariadb_icon from "../assets/mariadb.png";
import mysql_icon from "../assets/mysql.png";
import oraclesql_icon from "../assets/oraclesql.png";
import postgres_icon from "../assets/postgres.png";
import screenshot from "../assets/screenshot.png";
import sql_server_icon from "../assets/sql-server.png";
import sqlite_icon from "../assets/sqlite.png";
import warp from "../assets/warp.png";
import Navbar from "../components/Navbar";
import SimpleCanvas from "../components/SimpleCanvas";
import { diagram } from "../data/heroDiagram";
import { socials } from "../data/socials";
import { languages } from "../i18n/i18n";

function shortenNumber(number) {
  if (number < 1000) return number;

  if (number >= 1000 && number < 1_000_000) {
    return `${(number / 1000).toFixed(1)}k`;
  }

  return `${(number / 1_000_000).toFixed(1)}m`;
}

export default function LandingPage() {
  const [stats, setStats] = useState({ stars: 18000, forks: 1200 });

  useEffect(() => {
    const fetchStats = async () => {
      await axios
        .get("https://api.github-star-counter.workers.dev/user/drawdb-io")
        .then((res) => setStats(res.data));
    };

    document.body.setAttribute("theme-mode", "light");
    document.title =
      "drawDB | Online database diagram editor and SQL generator";

    fetchStats();
  }, []);

  return (
    <div className="bg-zinc-50 text-zinc-900">
      <FadeIn duration={0.6}>
        <Navbar />
      </FadeIn>

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-14 md:grid-cols-1 md:py-10 sm:px-4">
        <FadeIn duration={0.75}>
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
              Open-source database diagram editor
            </div>

            <div>
              <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight md:text-4xl sm:text-3xl">
                Modern schema design,
                <span className="block text-zinc-500">
                  without the complexity.
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 sm:text-base">
                Draw diagrams visually, import existing SQL, and export clean
                scripts from one minimal and professional workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/editor"
                className="inline-flex items-center rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                Start designing <i className="bi bi-arrow-right ms-2" />
              </Link>
              <button
                className="inline-flex cursor-pointer items-center rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                onClick={() =>
                  document
                    .getElementById("learn-more")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Learn more
              </button>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3 sm:grid-cols-1">
              <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <div className="text-2xl font-semibold">
                  {shortenNumber(stats.stars)}
                </div>
                <div className="text-xs text-zinc-500">GitHub stars</div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <div className="text-2xl font-semibold">
                  {shortenNumber(stats.forks)}
                </div>
                <div className="text-xs text-zinc-500">GitHub forks</div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <div className="text-2xl font-semibold">
                  {shortenNumber(languages.length)}
                </div>
                <div className="text-xs text-zinc-500">Languages</div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn duration={0.9}>
          <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-500">
              <span>ERD Workspace</span>
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-white">
                Live Preview
              </span>
            </div>
            <div className="h-[460px] overflow-hidden rounded-xl border border-zinc-200 bg-white md:h-[360px]">
              <SimpleCanvas diagram={diagram} zoom={0.85} />
            </div>
          </div>
        </FadeIn>
      </section>

      <section
        id="learn-more"
        className="border-y border-zinc-200 bg-white py-14"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-1 sm:px-4">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Supported by
            </div>
            <a href="https://warp.dev/drawdb" target="_blank" rel="noreferrer">
              <img src={warp} alt="warp.dev" width={220} className="mt-4" />
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Next-gen AI-powered intelligent terminal for all platforms.
              </p>
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Product overview
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Build diagrams with a few clicks, export SQL scripts, and
              customize the editor to your workflow.
            </p>
            <img
              src={screenshot}
              alt="drawdb editor"
              className="mt-4 rounded-lg border border-zinc-200"
            />
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl px-6 sm:px-4">
          <div className="mb-5 text-sm font-medium text-zinc-500">
            Works with your favorite databases
          </div>
          <div className="grid grid-cols-6 gap-3 md:grid-cols-3 sm:grid-cols-2">
            {dbs.map((s, i) => (
              <div
                key={"icon-" + i}
                className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-3"
              >
                <img
                  src={s.icon}
                  style={{ height: s.height }}
                  className="max-w-full scale-[0.78]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-14 sm:px-4">
        <FadeIn duration={1}>
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Features
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-2xl">
              Everything you need for schema work
            </h2>
          </div>

          <div className="mt-9 grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
            {features.map((f, i) => (
              <div
                key={"feature" + i}
                className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-zinc-900" />
                  <h3 className="text-base font-semibold">{f.title}</h3>
                </div>
                <div className="text-sm leading-relaxed text-zinc-600">
                  {f.content}
                </div>
                <div className="mt-2 text-xs text-zinc-500">{f.footer}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <section className="border-y border-zinc-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 sm:px-4">
          <div className="text-center text-2xl font-semibold tracking-tight md:text-xl">
            What the internet says about us
          </div>
          <div
            data-theme="light"
            className="mt-6 grid grid-cols-2 place-items-center gap-4 md:grid-cols-1"
          >
            <Tweet id="1816111365125218343" />
            <Tweet id="1817933406337905021" />
            <Tweet id="1785457354777006524" />
            <Tweet id="1776842268042756248" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-7 md:p-5">
          <div className="text-center">
            <h3 className="text-2xl font-semibold md:text-xl">
              Reach out to us
            </h3>
            <p className="mt-2 text-zinc-600">
              We love hearing from you. Join our community on Discord, GitHub,
              and X.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 md:grid-cols-1">
            <a
              href={socials.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-zinc-900 px-4 py-3 text-white transition hover:bg-zinc-700"
            >
              <img src={github} className="h-6" />
              <span className="text-sm font-medium">See the source</span>
            </a>
            <a
              href={socials.discord}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-[#5865F2] px-4 py-3 text-white transition hover:opacity-90"
            >
              <img src={discord} className="h-6" />
              <span className="text-sm font-medium">Join Discord</span>
            </a>
            <a
              href={socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-zinc-900 px-4 py-3 text-white transition hover:bg-zinc-700"
            >
              <i className="bi bi-twitter-x text-lg" />
              <span className="text-sm font-medium">Follow on X</span>
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-800">
          Attention: diagrams are saved in your browser. Back up your data
          before clearing browser storage.
        </div>

        <div className="mt-6 border-t border-zinc-200 pt-4 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} <strong>drawDB</strong> - All rights
          reserved.
        </div>
      </section>
    </div>
  );
}

const dbs = [
  { icon: mysql_icon, height: 80 },
  { icon: postgres_icon, height: 48 },
  { icon: sqlite_icon, height: 64 },
  { icon: mariadb_icon, height: 64 },
  { icon: sql_server_icon, height: 64 },
  { icon: oraclesql_icon, height: 172 },
];

const features = [
  {
    title: "Export",
    content: (
      <div>
        Export the DDL script to run on your database or export the diagram as a
        JSON or an image.
      </div>
    ),
    footer: "",
  },
  {
    title: "Reverse engineer",
    content: (
      <div>
        Already have a schema? Import a DDL script to generate a diagram.
      </div>
    ),
    footer: "",
  },
  {
    title: "Generate migrations",
    content: (
      <div>
        Version your diagram and generate migration scripts to update your
        database
      </div>
    ),
    footer: "",
  },
  {
    title: "Customizable workspace",
    content: (
      <div>
        Customize the UI to fit your preferences. Select the components you want
        in your view.
      </div>
    ),
    footer: "",
  },
  {
    title: "Keyboard shortcuts",
    content: (
      <div>
        Speed up development with keyboard shortcuts. See all available
        shortcuts
        <a
          href={`${socials.docs}/shortcuts`}
          target="_blank"
          rel="noreferrer"
          className="ms-1.5 text-zinc-900 underline-offset-4 hover:underline"
        >
          here
        </a>
        .
      </div>
    ),
    footer: "",
  },
  {
    title: "Templates",
    content: (
      <div>
        Start off with pre-built templates. Get a quick start or get inspiration
        for your design.
      </div>
    ),
    footer: "",
  },
  {
    title: "Custom Templates",
    content: (
      <div>
        Have boilerplate structures? Save time by saving them as templates and
        load them when needed.
      </div>
    ),
    footer: "",
  },
  {
    title: "Robust editor",
    content: (
      <div>
        Undo, redo, copy, paste, duplicate and more. Add tables, subject areas,
        and notes.
      </div>
    ),
    footer: "",
  },
  {
    title: "Issue detection",
    content: (
      <div>
        Detect and tackle errors in the diagram to make sure the scripts are
        correct.
      </div>
    ),
    footer: "",
  },
  {
    title: "Relational databases",
    content: (
      <div>
        We support 5 relational databases - MySQL, PostgreSQL, SQLite, MariaDB,
        SQL Server.
      </div>
    ),
    footer: "",
  },
  {
    title: "Object-Relational databases",
    content: (
      <div>
        Add custom types for object-relational databases, or create custom JSON
        schemes.
      </div>
    ),
    footer: "",
  },
  {
    title: "Presentation mode",
    content: (
      <div>
        Present your diagrams on a big screen during team meetings and
        discussions.
      </div>
    ),
    footer: "",
  },
];
