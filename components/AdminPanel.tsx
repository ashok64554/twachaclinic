"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Activity,
  Bell,
  CalendarDays,
  ContactRound,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  PencilLine,
  Plus,
  Save,
  Search,
  Settings,
  Star,
  Stethoscope,
  Trash2,
  UserRound,
  Users,
  Video
} from "lucide-react";
import type { ContentSection, Doctor, Service, SiteData, SitePage, Testimonial, VideoItem } from "@/lib/types";

type AdminSection = "dashboard" | "settings" | "pages" | "services" | "doctors" | "videos" | "testimonials" | "appointments" | "contactLeads" | "account";
type AdminUser = { id: number; username: string; email: string; role: string };

const navItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "settings", label: "Site Settings", icon: Settings },
  { id: "pages", label: "Pages", icon: FileText },
  { id: "services", label: "Services", icon: Stethoscope },
  { id: "doctors", label: "Doctors", icon: UserRound },
  { id: "videos", label: "Videos", icon: Video },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "contactLeads", label: "Contact Leads", icon: ContactRound },
  { id: "account", label: "Admin Account", icon: KeyRound }
];

const blankSection = (): ContentSection => ({ heading: "New section", body: [""] });
const nextId = (items: { id: number }[]) => Math.max(0, ...items.map((item) => item.id)) + 1;
const lines = (items: string[]) => items.join("\n");
const splitLines = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);

const adminRuntimeCss = `
  body { margin: 0; background: #f4f7fb; color: #080e20; font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif; }
  .admin-login-page { min-height: 100vh; display: grid; grid-template-columns: minmax(320px, 720px) minmax(260px, 1fr); background: linear-gradient(90deg, #fff 0 54%, #f3ebe3 54% 100%); color: #080e20; font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif; }
  .admin-login-panel { display: grid; align-content: center; min-height: 100vh; padding: 56px clamp(28px, 8vw, 92px); box-sizing: border-box; }
  .admin-login-card { max-width: 660px; padding: 42px 54px; background: rgba(255,255,255,.9); border: 1px solid #eadfe6; border-radius: 34px; box-shadow: 0 28px 70px rgba(86,97,127,.12); }
  .admin-login-card h1 { margin: 18px 0 20px; max-width: 560px; color: #56617f; font-size: clamp(42px, 5vw, 70px); line-height: .95; letter-spacing: 0; }
  .admin-login-card p { margin: 0 0 30px; color: #4f5b73; font-size: 18px; line-height: 1.65; }
  .admin-login-logo { width: 160px; height: auto; margin-bottom: 24px; }
  .admin-login-form { display: grid; gap: 20px; }
  .admin-login-field { display: grid; gap: 10px; color: #56617f; font-size: 14px; font-weight: 900; letter-spacing: .04em; text-transform: uppercase; }
  .admin-login-input { position: relative; }
  .admin-login-input input { width: 100%; min-height: 68px; padding: 0 58px 0 22px; color: #080e20; background: #fffdfb; border: 1px solid #dfcdda; border-radius: 18px; font: inherit; font-size: 19px; box-sizing: border-box; outline-color: #8d4d86; }
  .admin-login-input svg { position: absolute; right: 22px; top: 50%; color: #8d4d86; transform: translateY(-50%); }
  .admin-login-input button { position: absolute; right: 12px; top: 50%; display: grid; place-items: center; width: 44px; height: 44px; color: #56617f; background: transparent; border: 0; transform: translateY(-50%); cursor: pointer; }
  .admin-login-button { width: 100%; min-height: 72px; margin-top: 10px; color: white; background: linear-gradient(135deg, #56617f, #8d4d86); border: 0; border-radius: 22px; font: inherit; font-size: 18px; font-weight: 900; cursor: pointer; box-shadow: 0 18px 38px rgba(141,77,134,.25); }
  .admin-login-note { margin-top: 32px; padding: 22px; color: white; background: #56617f; border-radius: 24px; line-height: 1.7; }
  .admin-login-note b { color: #fff; }
  .admin-login-art { min-height: 100vh; background: radial-gradient(circle at 20% 20%, rgba(141,77,134,.2), transparent 34%), radial-gradient(circle at 70% 80%, rgba(214,154,120,.24), transparent 34%), #f3ebe3; }
  .admin-layout { display: grid; grid-template-columns: 280px minmax(0, 1fr); min-height: 100vh; background: #f4f7fb; }
  .admin-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; padding: 28px 14px; color: white; background: #080e20; box-sizing: border-box; }
  .admin-brand { display: grid; grid-template-columns: 64px 1fr; align-items: center; gap: 14px; padding: 12px 6px 28px; border-bottom: 1px solid rgba(255,255,255,.08); }
  .admin-brand img { width: 64px; height: 64px; object-fit: contain; background: white; border-radius: 24px; }
  .admin-brand small { display: block; color: #93a0b8; font-size: 12px; font-weight: 900; letter-spacing: .22em; text-transform: uppercase; }
  .admin-brand span { display: block; margin-top: 5px; color: white; font-size: 21px; font-weight: 900; }
  .admin-sidebar nav { display: grid; gap: 12px; padding-top: 22px; }
  .admin-sidebar button { display: flex; align-items: center; gap: 12px; min-height: 60px; padding: 0 18px; color: #c9d2e2; background: transparent; border: 1px solid transparent; border-radius: 26px; font: inherit; font-size: 16px; font-weight: 800; cursor: pointer; }
  .admin-sidebar button svg { width: 44px; height: 44px; padding: 12px; background: rgba(255,255,255,.06); border-radius: 16px; box-sizing: border-box; }
  .admin-sidebar button.active, .admin-sidebar button:hover { color: white; background: linear-gradient(135deg, #302682, #8d4d86); }
  .admin-main { min-width: 0; padding: 34px 38px; box-sizing: border-box; }
  .admin-topbar { display: grid; grid-template-columns: 68px minmax(260px, 1fr) 68px auto auto; align-items: center; gap: 18px; margin-bottom: 32px; }
  .admin-topbar > div:not(.admin-savebar) h1, .admin-topbar > div:not(.admin-savebar) .eyebrow { display: none; }
  .admin-back-button, .admin-icon-button { display: inline-grid; place-items: center; width: 68px; height: 68px; color: #080e20; background: white; border: 1px solid #dfe6f0; border-radius: 24px; box-shadow: 0 12px 28px rgba(8,14,32,.06); }
  .admin-icon-button { position: relative; }
  .admin-icon-button span { position: absolute; right: -6px; top: -8px; min-width: 30px; padding: 4px 8px; color: white; background: #df3f72; border-radius: 999px; font-size: 12px; font-weight: 900; box-sizing: border-box; }
  .admin-global-search { position: relative; display: block; }
  .admin-global-search svg { position: absolute; left: 24px; top: 50%; color: #93a0b8; transform: translateY(-50%); }
  .admin-global-search input, .admin-savebar input, .admin-form-grid input, .admin-form-grid textarea, .admin-form-grid select, .admin-sections-editor input, .admin-sections-editor textarea { width: 100%; min-height: 68px; padding: 17px 24px; color: #080e20; background: white; border: 1px solid #ccd7e7; border-radius: 22px; font: inherit; font-size: 17px; box-sizing: border-box; box-shadow: 0 9px 22px rgba(8,14,32,.04); }
  .admin-global-search input { height: 68px; padding-left: 62px; border-radius: 24px; box-shadow: 0 12px 28px rgba(8,14,32,.06); }
  .admin-savebar { display: flex; gap: 10px; align-items: center; padding: 10px; background: white; border: 1px solid #dfe6f0; border-radius: 26px; box-shadow: 0 12px 28px rgba(8,14,32,.06); }
  .admin-user-chip { display: grid; min-width: 168px; padding: 0 10px; }
  .admin-user-chip b { font-size: 15px; }
  .admin-user-chip small { color: #667085; }
  .primary-btn, .secondary-btn, .danger-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 18px; border: 0; border-radius: 16px; font: inherit; font-weight: 900; cursor: pointer; text-decoration: none; }
  .primary-btn { color: white; background: linear-gradient(135deg, #56617f, #8d4d86); }
  .secondary-btn { color: #080e20; background: #f5edf3; }
  .danger-btn { color: white; background: #b94343; }
  .admin-dashboard-hero, .admin-panel-card, .admin-list-panel, .admin-editor-panel, .admin-stat-grid article { background: white; border: 1px solid #dfe6f0; border-radius: 30px; box-shadow: 0 18px 45px rgba(8,14,32,.06); }
  .admin-dashboard-hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 28px; padding: 36px; }
  .admin-dashboard-hero h2 { margin: 8px 0 18px; font-size: clamp(34px, 4vw, 56px); line-height: 1; }
  .admin-dashboard-hero p { max-width: 760px; margin: 0; color: #516078; font-size: 19px; line-height: 1.7; }
  .eyebrow { color: #d99879; font-size: 13px; font-weight: 900; text-transform: uppercase; }
  .admin-dashboard-actions { display: grid; gap: 18px; }
  .admin-dashboard-actions button { display: grid; place-items: center; width: 66px; height: 66px; color: white; background: #080e20; border: 0; border-radius: 22px; cursor: pointer; }
  .admin-dashboard-actions button:first-child { background: #8d4d86; }
  .admin-stat-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 22px; margin-bottom: 24px; }
  .admin-stat-grid article { display: grid; gap: 8px; min-height: 150px; padding: 28px; box-sizing: border-box; }
  .admin-stat-grid span { color: #3e4658; font-weight: 900; letter-spacing: .22em; text-transform: uppercase; }
  .admin-stat-grid b { color: #080e20; font-size: 48px; }
  .admin-panel-card { padding: 36px; }
  .admin-editor-panel .admin-panel-card { position: relative; overflow: hidden; }
  .admin-editor-panel .admin-panel-card::before { content: ""; position: absolute; inset: 0 0 auto; height: 128px; background: linear-gradient(135deg, rgba(86,97,127,.08), rgba(141,77,134,.06)); pointer-events: none; }
  .admin-crud { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
  .admin-list-panel { position: static; max-height: none; overflow: visible; padding: 24px; box-sizing: border-box; }
  .admin-list-head, .admin-editor-head, .admin-title-row, .admin-editor-actions { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .admin-list-head h2 { margin: 0; font-size: clamp(28px, 3vw, 42px); }
  .admin-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; max-height: 360px; overflow: auto; margin-top: 16px; padding-right: 6px; }
  .admin-list button { display: grid; gap: 6px; width: 100%; min-height: 112px; padding: 18px; text-align: left; color: #080e20; background: #f7f9fc; border: 1px solid transparent; border-radius: 22px; cursor: pointer; box-sizing: border-box; }
  .admin-list button span { font-size: 17px; font-weight: 900; line-height: 1.25; }
  .admin-list button.selected { color: white; background: linear-gradient(135deg, #302682, #8d4d86); }
  .admin-list small, .admin-list em { color: #667085; font-style: normal; }
  .admin-list button.selected small, .admin-list button.selected em { color: rgba(255,255,255,.78); }
  .admin-editor-panel { min-width: 0; scroll-margin-top: 120px; }
  .admin-form-grid { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 26px 22px; margin-top: 28px; }
  .admin-form-grid label, .admin-sections-editor label { display: grid; gap: 12px; color: #344054; font-size: 18px; font-weight: 900; }
  .admin-form-grid label:has(textarea), .admin-form-grid .wide-field { grid-column: span 2; }
  .admin-form-grid .full-field { grid-column: 1 / -1; }
  .admin-form-grid textarea { min-height: 150px; resize: vertical; }
  .admin-editor-head { position: relative; align-items: flex-start; margin: -6px -6px 24px; padding: 20px 22px; background: rgba(255,255,255,.72); border: 1px solid #e0e7f1; border-radius: 28px; }
  .admin-editor-head h2 { margin: 8px 0 0; font-size: clamp(28px, 3vw, 42px); line-height: 1.05; }
  .admin-section-edit { display: grid; grid-template-columns: minmax(240px, .7fr) minmax(320px, .9fr) minmax(0, 1.4fr); gap: 18px; align-items: start; padding: 22px; background: #f7f9fc; border: 1px solid #dfe6f0; border-radius: 24px; }
  .admin-section-edit > button { grid-column: 1 / -1; justify-self: start; }
  .admin-section-edit textarea { min-height: 260px; line-height: 1.6; }
  .admin-sections-editor { position: relative; display: grid; gap: 16px; margin-top: 34px; padding-top: 26px; border-top: 1px solid #e4eaf3; }
  .admin-sections-editor h3 { margin: 0; font-size: 28px; }
  .admin-image-field { display: grid; gap: 12px; color: #344054; font-size: 18px; font-weight: 900; }
  .admin-image-uploader { display: grid; grid-template-columns: 118px 1fr; gap: 14px; align-items: center; min-height: 132px; padding: 12px; background: white; border: 1px solid #ccd7e7; border-radius: 22px; box-shadow: 0 9px 22px rgba(8,14,32,.04); }
  .admin-image-uploader img, .admin-image-placeholder { width: 118px; height: 104px; object-fit: cover; background: #f1f4f8; border-radius: 16px; }
  .admin-image-placeholder { display: grid; place-items: center; color: #93a0b8; font-size: 13px; text-align: center; }
  .admin-image-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .admin-file-button { position: relative; overflow: hidden; }
  .admin-file-button input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .admin-image-url { color: #667085; font-size: 13px; font-weight: 700; word-break: break-all; }
  .admin-message { color: #8d4d86; font-weight: 800; }
  .admin-rich-editor { display: grid; gap: 10px; }
  .admin-editor-toolbar { display: flex; flex-wrap: wrap; gap: 8px; }
  .admin-editor-toolbar button { min-height: 38px; padding: 0 14px; color: #56617f; background: #f5edf3; border: 1px solid #ead7e7; border-radius: 999px; font: inherit; font-size: 13px; font-weight: 900; cursor: pointer; }
  .admin-rich-editor textarea { min-height: 220px; line-height: 1.65; }
  .admin-html-editor { display: grid; grid-column: 1 / -1; gap: 12px; color: #3a4960; font-size: 13px; font-weight: 850; letter-spacing: .26em; text-transform: uppercase; }
  .admin-html-editor-title { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .admin-html-editor-title span { color: #667085; font-size: 12px; font-weight: 800; letter-spacing: 0; text-transform: none; }
  .admin-html-editor-toolbar { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; background: #f8fafc; border: 1px solid #dbe3ee; border-radius: 18px; }
  .admin-html-editor-toolbar button { min-height: 38px; padding: 0 14px; color: #56617f; background: #f7edf4; border: 1px solid #ead8e6; border-radius: 999px; font: inherit; font-size: 13px; font-weight: 900; letter-spacing: 0; text-transform: none; cursor: pointer; }
  .admin-html-editor-toolbar button.active { color: white; background: linear-gradient(135deg, #56617f, #8d4d86); border-color: transparent; }
  .admin-html-editor-canvas { min-height: 560px; max-height: 72vh; overflow: auto; padding: 28px; color: #172033; background: #fff; border: 1px solid #cbd8e8; border-radius: 22px; box-shadow: 0 10px 28px rgba(15,23,42,.06); font-size: 17px; font-weight: 400; line-height: 1.75; letter-spacing: 0; text-transform: none; outline-color: #8d4d86; }
  .admin-html-editor-canvas h1, .admin-html-editor-canvas h2, .admin-html-editor-canvas h3 { margin: 18px 0 10px; color: #080e20; line-height: 1.12; }
  .admin-html-editor-canvas p { margin: 0 0 14px; }
  .admin-html-editor-canvas img { max-width: 100%; height: auto; border-radius: 12px; }
  .admin-html-editor-canvas a { color: #8d4d86; font-weight: 800; }
  .admin-html-editor-canvas ul, .admin-html-editor-canvas ol { padding-left: 24px; }
  .admin-html-editor-source { min-height: 560px !important; max-height: 72vh; overflow: auto; font-family: Consolas, "Courier New", monospace !important; font-size: 14px !important; line-height: 1.65 !important; }
  .admin-html-editor-help { margin: 0; color: #667085; font-size: 13px; font-weight: 700; letter-spacing: 0; line-height: 1.55; text-transform: none; }
  .admin-account-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 24px; align-items: start; }
  .admin-account-card { padding: 28px; background: #f7f9fc; border: 1px solid #dfe6f0; border-radius: 24px; }
  .admin-account-card h3 { margin: 0 0 18px; font-size: 24px; }
  .admin-account-card p { margin: 8px 0; color: #4f5b73; }
  .lead-list { display: grid; gap: 14px; margin-top: 20px; }
  .lead-list article { display: grid; grid-template-columns: minmax(180px, .8fr) minmax(0, 1.2fr) auto; gap: 18px; align-items: center; padding: 20px; background: #f7f9fc; border: 1px solid #dfe6f0; border-radius: 24px; }
  .lead-list b { font-size: 20px; }
  .lead-list span, .lead-list small { display: block; color: #667085; }
  .lead-list p { margin: 0; color: #344054; line-height: 1.55; }

  /* Clear CRM-style admin layout */
  .admin-layout { grid-template-columns: 360px minmax(0, 1fr); background: #f6f9fd; font-family: "Segoe UI", Inter, Roboto, Arial, sans-serif; }
  .admin-sidebar { padding: 34px 24px; background: #090f20; border-right: 1px solid #d6dfeb; }
  .admin-brand { grid-template-columns: 70px 1fr; gap: 18px; padding: 8px 0 34px; }
  .admin-brand img { width: 70px; height: 70px; border-radius: 24px; }
  .admin-brand small { color: #9da9bf; font-size: 14px; letter-spacing: .32em; line-height: 1.8; }
  .admin-brand span { font-size: 30px; line-height: 1.18; }
  .admin-sidebar nav { gap: 10px; padding-top: 30px; }
  .admin-sidebar button { min-height: 64px; padding: 0 18px; border-radius: 0; color: #c9d4e7; font-size: 21px; font-weight: 800; letter-spacing: 0; }
  .admin-sidebar button svg { width: 56px; height: 56px; padding: 16px; border-radius: 18px; background: rgba(255,255,255,.06); color: #dce5f6; }
  .admin-sidebar button.active, .admin-sidebar button:hover { background: linear-gradient(90deg, rgba(86,97,127,.92), rgba(141,77,134,.95)); border-radius: 24px; color: white; }
  .admin-sidebar button.active svg, .admin-sidebar button:hover svg { background: rgba(255,255,255,.12); color: white; }
  .admin-main { padding: 0 38px 44px; }
  .admin-topbar { position: sticky; top: 0; z-index: 10; grid-template-columns: 76px minmax(340px, 1fr) 70px auto; margin: 0 -38px 28px; padding: 26px 38px; background: rgba(255,255,255,.94); border-bottom: 1px solid #dbe3ee; backdrop-filter: blur(14px); }
  .admin-back-button, .admin-icon-button { width: 66px; height: 66px; border-radius: 22px; box-shadow: 0 10px 24px rgba(13,21,40,.06); }
  .admin-back-button { color: white; background: #080e20; }
  .admin-global-search input { height: 66px; min-height: 66px; border-radius: 22px; border-color: #d8e1ed; color: #172033; font-size: 20px; box-shadow: 0 10px 22px rgba(13,21,40,.05); }
  .admin-global-search input::placeholder { color: #94a3b8; }
  .admin-savebar { min-height: 66px; padding: 8px 12px; border-radius: 24px; }
  .admin-user-chip { min-width: 150px; }
  .admin-user-chip b { color: #172033; font-size: 18px; line-height: 1.2; }
  .admin-user-chip small { color: #64748b; font-size: 15px; }
  .primary-btn, .secondary-btn, .danger-btn { min-height: 50px; padding: 0 22px; border-radius: 18px; font-size: 17px; font-weight: 800; }
  .secondary-btn { color: #334155; background: white; border: 1px solid #dbe3ee; }
  .primary-btn { background: linear-gradient(135deg, #56617f, #8d4d86); box-shadow: 0 14px 26px rgba(86,97,127,.18); }
  .admin-dashboard-hero, .admin-panel-card, .admin-list-panel, .admin-editor-panel, .admin-stat-grid article { border-color: #dbe3ee; border-radius: 26px; box-shadow: 0 18px 40px rgba(15,23,42,.05); }
  .admin-dashboard-hero { margin-top: 10px; padding: 38px; }
  .admin-dashboard-hero h2, .admin-list-head h2, .admin-editor-head h2, .admin-title-row h2 { color: #080e20; font-weight: 900; letter-spacing: 0; }
  .admin-panel-card { padding: 34px 36px; }
  .admin-editor-panel .admin-panel-card::before { display: none; }
  .admin-crud { gap: 22px; }
  .admin-list-panel { padding: 28px; }
  .admin-list-head { align-items: center; padding-bottom: 18px; border-bottom: 1px solid #e3eaf3; }
  .admin-list-head h2 { font-size: 34px; }
  .admin-search { display: none; }
  .admin-list { grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); max-height: 250px; gap: 14px; margin-top: 20px; }
  .admin-list button { min-height: 92px; padding: 18px 22px; border: 1px solid #e3eaf3; border-radius: 22px; background: #f8fafc; }
  .admin-list button span { font-size: 19px; font-weight: 850; }
  .admin-list button.selected { background: linear-gradient(135deg, #56617f, #8d4d86); border-color: transparent; }
  .admin-editor-head { margin: 0 0 30px; padding: 0 0 24px; background: transparent; border: 0; border-bottom: 1px solid #e3eaf3; border-radius: 0; }
  .admin-editor-head h2 { font-size: clamp(28px, 2.4vw, 42px); line-height: 1.14; }
  .admin-form-grid { grid-template-columns: repeat(4, minmax(210px, 1fr)); gap: 28px 24px; margin-top: 0; }
  .admin-form-grid label, .admin-sections-editor label, .admin-image-field { gap: 12px; color: #334155; font-size: 20px; font-weight: 750; line-height: 1.25; }
  .admin-global-search input, .admin-form-grid input, .admin-form-grid textarea, .admin-form-grid select, .admin-sections-editor input, .admin-sections-editor textarea { min-height: 68px; padding: 16px 24px; border: 1px solid #cbd8e8; border-radius: 22px; background: white; color: #111827; font-size: 20px; font-weight: 500; line-height: 1.35; box-shadow: 0 8px 18px rgba(15,23,42,.04); }
  .admin-form-grid textarea, .admin-rich-editor textarea, .admin-sections-editor textarea { min-height: 190px; resize: vertical; line-height: 1.62; }
  .admin-form-grid label:has(textarea), .admin-form-grid .wide-field { grid-column: span 2; }
  .admin-rich-editor.wide-field { grid-column: span 2; }
  .admin-section-edit { grid-template-columns: minmax(240px, .85fr) minmax(320px, 1fr) minmax(420px, 1.5fr); gap: 24px; padding: 28px; background: #f8fafc; border-color: #dbe3ee; border-radius: 26px; }
  .admin-section-edit .admin-rich-editor { grid-column: 1 / -1; }
  .admin-section-edit textarea { min-height: 260px; }
  .admin-sections-editor { gap: 22px; margin-top: 38px; padding-top: 32px; }
  .admin-sections-editor h3 { color: #080e20; font-size: 30px; }
  .admin-image-uploader { min-height: 146px; border-color: #cbd8e8; border-radius: 22px; box-shadow: 0 8px 18px rgba(15,23,42,.04); }
  .admin-image-uploader img, .admin-image-placeholder { width: 126px; height: 112px; border-radius: 18px; }
  .admin-editor-toolbar button { color: #56617f; background: #f7edf4; border-color: #ead8e6; font-size: 14px; }
  .admin-account-card, .lead-list article { border-color: #dbe3ee; border-radius: 24px; background: #f8fafc; }
  .admin-crud { gap: 34px; }
  .admin-crud-hero { display: flex; align-items: center; justify-content: space-between; gap: 28px; padding: 34px 36px; background: white; border: 1px solid #dbe3ee; border-radius: 30px; box-shadow: 0 20px 44px rgba(15,23,42,.06); }
  .admin-crud-hero h2 { margin: 12px 0 10px; color: #020817; font-size: clamp(30px, 2.7vw, 48px); line-height: 1.05; letter-spacing: -.02em; }
  .admin-crud-hero p { max-width: 780px; margin: 0; color: #52617a; font-size: 17px; line-height: 1.65; }
  .admin-crud-actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: flex-end; }
  .admin-filter-strip { display: grid; gap: 22px; padding: 34px 36px; background: white; border: 1px solid #dbe3ee; border-radius: 30px; box-shadow: 0 20px 44px rgba(15,23,42,.05); }
  .admin-filter-strip .admin-list-head { padding: 0; border: 0; }
  .admin-filter-strip .admin-list-head h2 { margin: 10px 0 8px; font-size: 34px; letter-spacing: -.02em; }
  .admin-filter-strip .admin-list-head p { margin: 0; color: #52617a; font-size: 16px; line-height: 1.55; }
  .admin-filter-strip .admin-search { position: relative; display: block; max-width: 460px; }
  .admin-filter-strip .admin-search svg { position: absolute; left: 20px; top: 50%; color: #94a3b8; transform: translateY(-50%); }
  .admin-filter-strip .admin-search input { width: 100%; min-height: 56px; padding: 0 20px 0 54px; border: 1px solid #cbd8e8; border-radius: 18px; background: #f8fafc; color: #111827; font: inherit; font-size: 16px; box-sizing: border-box; }
  .admin-list { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); max-height: 310px; margin-top: 0; }
  .admin-editor-panel .admin-panel-card { padding: 36px; border-radius: 30px; }
  .admin-editor-head { padding: 0 0 30px; }
  .admin-form-grid { grid-template-columns: repeat(4, minmax(220px, 1fr)); gap: 30px 24px; }
  .admin-form-grid label, .admin-sections-editor label, .admin-image-field { color: #3a4960; font-size: 13px; font-weight: 850; letter-spacing: .26em; text-transform: uppercase; }
  .admin-global-search input, .admin-form-grid input, .admin-form-grid textarea, .admin-form-grid select, .admin-sections-editor input, .admin-sections-editor textarea { min-height: 58px; padding: 14px 20px; border-radius: 18px; font-size: 17px; letter-spacing: 0; text-transform: none; }
  .admin-form-grid textarea, .admin-rich-editor textarea, .admin-sections-editor textarea { min-height: 170px; }
  .admin-rich-editor { letter-spacing: .26em; text-transform: uppercase; }
  .admin-rich-editor textarea { letter-spacing: 0; text-transform: none; }
  .admin-section-edit { display: grid; grid-template-columns: repeat(2, minmax(260px, 1fr)); gap: 26px; padding: 32px; background: white; }
  .admin-section-edit .admin-rich-editor { grid-column: 1 / -1; }
  .admin-section-edit > button { justify-self: start; }
  .admin-data-table-wrap { overflow: auto; margin-top: 8px; border: 1px solid #dbe3ee; border-radius: 22px; background: white; }
  .admin-data-table { width: 100%; border-collapse: collapse; min-width: 780px; }
  .admin-data-table th { padding: 18px 22px; color: #52617a; background: #f8fafc; border-bottom: 1px solid #e3eaf3; text-align: left; font-size: 12px; font-weight: 900; letter-spacing: .26em; text-transform: uppercase; }
  .admin-data-table td { padding: 18px 22px; color: #334155; border-bottom: 1px solid #edf2f7; font-size: 16px; vertical-align: middle; }
  .admin-data-table tbody tr:last-child td { border-bottom: 0; }
  .admin-data-table tbody tr.selected td { background: #fbf7fb; }
  .admin-table-title { padding: 0; color: #061024; background: transparent; border: 0; font: inherit; font-size: 17px; font-weight: 850; text-align: left; cursor: pointer; }
  .admin-status { display: inline-flex; align-items: center; justify-content: center; min-height: 34px; padding: 0 12px; border-radius: 999px; font-size: 12px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
  .admin-status.active { color: #08734f; background: #eaf8f1; }
  .admin-status.draft { color: #865a10; background: #fff4dc; }
  .admin-row-actions { display: flex; gap: 10px; align-items: center; }
  .admin-row-actions button, .admin-row-actions a { display: inline-grid; place-items: center; width: 42px; height: 42px; color: #56617f; background: white; border: 1px solid #dbe3ee; border-radius: 14px; cursor: pointer; text-decoration: none; }
  .admin-row-actions button:hover, .admin-row-actions a:hover { color: #8d4d86; background: #f8eef5; }
  .admin-row-actions .delete { color: #b94343; }
  .admin-row-actions .delete:hover { color: white; background: #b94343; border-color: #b94343; }

  /* Softer admin typography, closer to the reference */
  body,
  .admin-layout,
  .admin-login-page {
    font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    font-weight: 400;
    letter-spacing: 0;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  .admin-breadcrumb { font-size: 24px; }
  .admin-breadcrumb span { font-weight: 650; }
  .admin-breadcrumb b { font-weight: 720; }
  .admin-sidebar button { font-size: 18px; font-weight: 650; }
  .admin-nav-group { font-size: 12px; font-weight: 800; letter-spacing: .28em; }
  .admin-settings-hero h2,
  .admin-crud-hero h2,
  .admin-dashboard-hero h2,
  .admin-access-security h2,
  .admin-access-card h3,
  .admin-editor-head h2,
  .admin-title-row h2 {
    font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    font-weight: 760;
    letter-spacing: -.035em;
  }
  .admin-settings-hero h2,
  .admin-crud-hero h2 { font-size: clamp(38px, 4.2vw, 58px); }
  .admin-settings-hero p,
  .admin-crud-hero p,
  .admin-access-security p,
  .admin-access-stat p,
  .admin-access-card p,
  .admin-filter-strip .admin-list-head p,
  .admin-dashboard-hero p {
    color: #53627a;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.62;
  }
  .eyebrow,
  .admin-mini-card span,
  .admin-access-stat span,
  .admin-access-card span,
  .admin-data-table th,
  .admin-form-grid label,
  .admin-sections-editor label,
  .admin-image-field,
  .admin-access-form label {
    font-size: 12px;
    font-weight: 760;
    letter-spacing: .24em;
  }
  .admin-access-security h2 { font-size: clamp(24px, 2vw, 31px); }
  .admin-access-form label { color: #53627a; }
  .admin-access-input input,
  .admin-form-grid input,
  .admin-form-grid textarea,
  .admin-form-grid select,
  .admin-sections-editor input,
  .admin-sections-editor textarea,
  .admin-hero-search input,
  .admin-filter-strip .admin-search input {
    font-size: 15.5px;
    font-weight: 420;
    color: #172033;
  }
  .primary-btn,
  .secondary-btn,
  .danger-btn,
  .admin-login-button {
    font-weight: 720;
  }
  .admin-table-title { font-size: 16px; font-weight: 680; }
  .admin-status { font-weight: 720; }

  /* A aroyaa-style slim header */
  .admin-layout { grid-template-columns: 324px minmax(0, 1fr); background: #f4f7fb; }
  .admin-sidebar { padding: 28px 16px; background: #0b1020; }
  .admin-brand { display: block; padding: 0 0 44px; border-bottom: 0; }
  .admin-brand img { width: 190px; height: auto; max-height: 78px; object-fit: contain; background: transparent; border-radius: 0; }
  .admin-brand small, .admin-brand span { display: none; }
  .admin-sidebar nav { gap: 22px; padding-top: 18px; }
  .admin-sidebar button { min-height: 54px; padding: 0 16px; color: #a8b3c7; border-radius: 16px; font-size: 18px; font-weight: 750; }
  .admin-sidebar button svg { width: 46px; height: 46px; padding: 13px; border-radius: 17px; background: rgba(255,255,255,.05); }
  .admin-sidebar button.active, .admin-sidebar button:hover { background: transparent; color: #f8fafc; }
  .admin-sidebar button.active svg, .admin-sidebar button:hover svg { background: rgba(141,77,134,.35); color: #fff; }
  .admin-main { padding: 0 44px 48px; }
  .admin-topbar { display: flex; align-items: center; justify-content: space-between; min-height: 92px; margin: 0 -44px 36px; padding: 0 44px 0 58px; background: #fff; border-bottom: 1px solid #dbe3ee; box-shadow: none; }
  .admin-top-left { display: flex; align-items: center; gap: 36px; min-width: 0; }
  .admin-page-menu { display: inline-grid; place-items: center; width: 42px; height: 42px; color: #64748b; background: transparent; border: 0; cursor: pointer; }
  .admin-breadcrumb { display: flex; align-items: center; gap: 14px; min-width: 0; font-size: 25px; line-height: 1; }
  .admin-breadcrumb span { color: #94a3b8; font-weight: 800; }
  .admin-breadcrumb em { color: #cbd5e1; font-style: normal; font-weight: 800; }
  .admin-breadcrumb b { color: #020817; font-weight: 900; }
  .admin-top-actions { display: flex; align-items: center; gap: 16px; }
  .admin-top-actions .primary-btn, .admin-top-actions .secondary-btn { min-height: 46px; padding: 0 18px; border-radius: 14px; font-size: 15px; }
  .admin-icon-button { width: 48px; height: 48px; color: #64748b; background: transparent; border: 0; box-shadow: none; }
  .admin-icon-button span { right: -2px; top: -2px; min-width: 22px; padding: 3px 6px; background: #ff9f1a; font-size: 11px; }
  .admin-avatar { display: inline-grid; place-items: center; width: 50px; height: 50px; color: white; background: #ff9f1a; border: 0; border-radius: 50%; font: inherit; font-size: 18px; font-weight: 800; cursor: pointer; }
  .admin-crud-hero, .admin-filter-strip, .admin-panel-card, .admin-dashboard-hero { border-radius: 28px; }
  .admin-crud-hero { margin-top: 0; padding: 36px; }
  .admin-crud-hero h2 { font-size: clamp(40px, 4vw, 58px); }
  .admin-nav-group { margin: 28px 14px 8px; color: #69758c; font-size: 12px; font-weight: 900; letter-spacing: .34em; text-transform: uppercase; }
  .admin-sidebar-logout { position: sticky; bottom: 0; margin-top: 28px; padding-top: 16px; background: linear-gradient(180deg, rgba(11,16,32,0), #0b1020 18%); }
  .admin-sidebar-logout button { justify-content: center; width: 100%; min-height: 56px; color: #f8fafc; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 16px; }
  .admin-sidebar-logout button svg { width: auto; height: auto; padding: 0; background: transparent; }
  .admin-top-actions .secondary-btn { display: none; }
  .admin-settings-hero { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 28px; align-items: center; margin-bottom: 28px; padding: 38px 36px; background: white; border: 1px solid #dbe3ee; border-radius: 30px; box-shadow: 0 20px 44px rgba(15,23,42,.06); }
  .admin-settings-hero h2 { margin: 14px 0 12px; color: #020817; font-size: clamp(42px, 5vw, 62px); line-height: 1; letter-spacing: -.03em; }
  .admin-settings-hero p { margin: 0; color: #52617a; font-size: 18px; line-height: 1.6; }
  .admin-hero-search { position: relative; min-width: 340px; }
  .admin-hero-search svg { position: absolute; left: 20px; top: 50%; color: #94a3b8; transform: translateY(-50%); }
  .admin-hero-search input { width: 100%; min-height: 56px; padding: 0 18px 0 54px; border: 1px solid #cbd8e8; border-radius: 18px; background: #f8fafc; color: #111827; font: inherit; font-size: 16px; box-sizing: border-box; }
  .admin-mini-card-grid { display: grid; grid-template-columns: repeat(5, minmax(150px, 1fr)); gap: 18px; margin-bottom: 28px; }
  .admin-mini-card { min-height: 150px; padding: 24px 22px; background: white; border: 1px solid #dbe3ee; border-radius: 24px; box-shadow: 0 18px 38px rgba(15,23,42,.05); box-sizing: border-box; }
  .admin-mini-card span { display: block; color: #ff8a00; font-size: 12px; font-weight: 900; letter-spacing: .32em; text-transform: uppercase; }
  .admin-mini-card b { display: block; margin: 18px 0 10px; color: #020817; font-size: 30px; line-height: 1.05; }
  .admin-mini-card p { margin: 0; color: #52617a; font-size: 15px; line-height: 1.55; }
  .admin-access-page { display: grid; gap: 34px; }
  .admin-access-security { display: grid; grid-template-columns: minmax(320px, .78fr) minmax(520px, 1.22fr); gap: 34px; align-items: center; padding: 34px 28px; background: white; border: 1px solid #dbe3ee; border-radius: 28px; box-shadow: 0 20px 44px rgba(15,23,42,.06); }
  .admin-access-security h2 { margin: 16px 0 16px; color: #063f31; font-size: clamp(26px, 2.2vw, 34px); line-height: 1.14; letter-spacing: -.02em; }
  .admin-access-security p { margin: 0 0 18px; color: #52617a; font-size: 16px; line-height: 1.6; }
  .admin-access-pill { display: inline-flex; align-items: center; gap: 8px; min-height: 36px; padding: 0 14px; color: #064536; background: #f3eadc; border-radius: 999px; font-size: 13px; font-weight: 900; text-transform: uppercase; }
  .admin-access-form { display: grid; grid-template-columns: repeat(3, minmax(170px, 1fr)); gap: 20px; align-items: end; }
  .admin-access-form label { display: grid; gap: 12px; color: #3a4960; font-size: 12px; font-weight: 850; letter-spacing: .28em; text-transform: uppercase; }
  .admin-access-input { position: relative; }
  .admin-access-input input { width: 100%; min-height: 52px; padding: 0 48px 0 18px; color: #111827; background: #f8fafc; border: 1px solid #cbd8e8; border-radius: 16px; font: inherit; font-size: 15px; box-sizing: border-box; }
  .admin-access-input svg { position: absolute; right: 16px; top: 50%; color: #94a3b8; transform: translateY(-50%); }
  .admin-access-help { grid-column: span 2; margin: 0; color: #52617a; font-size: 15px; line-height: 1.5; }
  .admin-access-form .primary-btn { justify-self: end; min-width: 170px; background: #108a5b; box-shadow: none; }
  .admin-access-stat-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
  .admin-access-stat { min-height: 160px; padding: 26px; background: white; border: 1px solid #dbe3ee; border-radius: 26px; box-shadow: 0 18px 38px rgba(15,23,42,.05); }
  .admin-access-stat span, .admin-access-card span { display: block; color: #ff8a00; font-size: 12px; font-weight: 900; letter-spacing: .32em; text-transform: uppercase; }
  .admin-access-stat b { display: block; margin: 22px 0 12px; color: #020817; font-size: 38px; line-height: 1; }
  .admin-access-stat p, .admin-access-card p { margin: 0; color: #52617a; font-size: 16px; line-height: 1.65; }
  .admin-access-card-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; }
  .admin-access-card { padding: 32px 28px; background: white; border: 1px solid #dbe3ee; border-radius: 28px; box-shadow: 0 18px 38px rgba(15,23,42,.05); }
  .admin-access-card h3 { margin: 18px 0 18px; color: #020817; font-size: clamp(26px, 2.2vw, 34px); line-height: 1.14; }
  .admin-chip-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
  .admin-chip-row i { display: inline-flex; align-items: center; min-height: 38px; padding: 0 14px; color: #064536; background: white; border: 1px solid #cbd8e8; border-radius: 999px; font-style: normal; font-size: 13px; font-weight: 850; text-transform: uppercase; }
  @media (max-width: 1280px) { .admin-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 1280px) { .admin-mini-card-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .admin-settings-hero { grid-template-columns: 1fr; } .admin-hero-search { min-width: 0; } }
  @media (max-width: 1280px) { .admin-access-security, .admin-access-card-grid { grid-template-columns: 1fr; } .admin-access-form { grid-template-columns: 1fr; } .admin-access-help { grid-column: auto; } .admin-access-form .primary-btn { justify-self: start; } }
  @media (max-width: 1280px) { .admin-section-edit { grid-template-columns: repeat(2, minmax(0, 1fr)); } .admin-section-edit label:has(textarea) { grid-column: 1 / -1; } }
  @media (max-width: 980px) { .admin-login-page, .admin-layout, .admin-crud, .admin-topbar, .admin-stat-grid, .admin-form-grid, .admin-section-edit, .lead-list article, .admin-account-grid { grid-template-columns: 1fr; } .admin-login-art { display: none; } .admin-sidebar { position: static; height: auto; } .admin-sidebar nav { grid-template-columns: repeat(2, minmax(0, 1fr)); } .admin-savebar { flex-direction: column; align-items: stretch; } .admin-form-grid label:has(textarea), .admin-form-grid .wide-field, .admin-section-edit label:has(textarea) { grid-column: auto; } .admin-image-uploader { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .admin-main { padding: 18px; } .admin-sidebar nav { grid-template-columns: 1fr; } .admin-dashboard-hero { flex-direction: column; align-items: flex-start; } .admin-panel-card { padding: 22px; } }
  @media (min-width: 1200px) and (max-width: 1600px) {
    .admin-layout { grid-template-columns: clamp(248px, 19vw, 300px) minmax(0, 1fr); }
    .admin-sidebar { padding: 22px 12px; }
    .admin-sidebar nav { gap: 12px; }
    .admin-sidebar button { min-height: 50px; padding: 0 12px; border-radius: 14px; font-size: 16px; }
    .admin-sidebar button svg { width: 42px; height: 42px; padding: 12px; border-radius: 14px; }
    .admin-main { padding: 0 clamp(22px, 2.2vw, 36px) 40px; }
    .admin-topbar { min-height: 78px; margin: 0 calc(clamp(22px, 2.2vw, 36px) * -1) 28px; padding: 0 clamp(22px, 2.2vw, 36px); gap: 14px; }
    .admin-brand img { width: clamp(148px, 12vw, 180px); max-height: 68px; }
    .admin-breadcrumb { font-size: clamp(18px, 1.6vw, 23px); }
    .admin-crud-hero, .admin-filter-strip, .admin-panel-card, .admin-dashboard-hero { padding: clamp(24px, 2vw, 32px); border-radius: 24px; }
    .admin-crud-hero h2, .admin-settings-hero h2, .admin-dashboard-hero h1 { font-size: clamp(34px, 3vw, 48px); }
    .admin-stat-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; }
    .admin-stat-grid article { min-height: 128px; padding: 20px; }
    .admin-stat-grid b { font-size: 36px; }
    .admin-form-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px 18px; }
    .admin-form-grid label:has(textarea), .admin-form-grid .wide-field, .admin-rich-editor.wide-field { grid-column: 1 / -1; }
    .admin-section-edit { grid-template-columns: minmax(220px, .9fr) minmax(280px, 1fr); gap: 20px; }
    .admin-section-edit .admin-rich-editor { grid-column: 1 / -1; }
    .admin-data-table { min-width: 720px; }
    .admin-data-table th, .admin-data-table td { padding: 14px 16px; }
    .admin-mini-card-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; }
    .admin-access-form { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
  @media (min-width: 1200px) and (max-width: 1450px) {
    .admin-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .admin-form-grid label:has(textarea), .admin-form-grid .wide-field, .admin-rich-editor.wide-field { grid-column: 1 / -1; }
    .admin-stat-grid, .admin-mini-card-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .admin-access-form { grid-template-columns: 1fr 1fr; }
  }
`;

export function AdminPanel() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [login, setLogin] = useState("admin@twachaclinic.com");
  const [loginPassword, setLoginPassword] = useState("admin@12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState<SiteData | null>(null);
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState({ pages: 0, services: 0, doctors: 0, videos: 0, testimonials: 0 });
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const response = await fetch("/api/admin/me");
    if (response.ok) {
      const result = await response.json() as { user: AdminUser };
      setAdminUser(result.user);
      await reloadData();
    }
    setAuthChecked(true);
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password: loginPassword })
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || "Invalid admin login.");
      return;
    }
    setAdminUser(result.user);
    setLoginPassword("");
    await reloadData();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAdminUser(null);
    setData(null);
    setSection("dashboard");
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (passwordForm.next !== passwordForm.confirm) {
      setMessage("New password and confirm password do not match.");
      return;
    }
    const response = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: passwordForm.current, newPassword: passwordForm.next })
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || "Password could not be changed.");
      return;
    }
    setPasswordForm({ current: "", next: "", confirm: "" });
    setMessage("Admin password changed successfully.");
  }

  async function reloadData() {
    const response = await fetch("/api/site-data");
    const next = await response.json();
    setData(next);
  }

  const stats = useMemo(() => {
    if (!data) return [];
    return [
      { label: "Pages", value: data.pages.length, icon: FileText },
      { label: "Services", value: data.services.length, icon: Stethoscope },
      { label: "Doctors", value: data.doctors.length, icon: Users },
      { label: "Videos", value: data.videos?.length || 0, icon: Video },
      { label: "Appointments", value: data.appointments.length, icon: CalendarDays },
      { label: "Contact Leads", value: data.contactLeads.length, icon: ContactRound }
    ];
  }, [data]);

  async function save(next = data) {
    if (!next) return;
    setMessage("");
    const response = await fetch("/api/site-data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });
    setMessage(response.ok ? "Saved successfully." : "Please login again or check the edited data.");
    if (response.ok) await reloadData();
  }

  function mutate(next: SiteData) {
    setData(next);
  }

  function filterByQuery<T extends { title?: string; name?: string; slug?: string }>(items: T[]) {
    const term = query.trim().toLowerCase();
    if (!term) return items.map((item, index) => ({ item, index }));
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => [item.title, item.name, item.slug].filter(Boolean).join(" ").toLowerCase().includes(term));
  }

  function focusEditor() {
    window.setTimeout(() => {
      document.getElementById("admin-editor-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function selectAndOpen(patch: Partial<typeof selected>) {
    setSelected((currentSelected) => ({ ...currentSelected, ...patch }));
    focusEditor();
  }

  if (!authChecked) return <main className="admin-shell">Loading admin...</main>;
  if (!adminUser) {
    return (
      <>
        <style>{adminRuntimeCss}</style>
        <main className="admin-login-page">
          <section className="admin-login-panel">
            <div className="admin-login-card">
              <img className="admin-login-logo" src="/assets/img/twacha-logo.png" alt="Twacha Skin Clinic" />
              <span className="eyebrow">Admin access</span>
              <h1>Sign in to the control room</h1>
              <p>Use your Twacha admin account to manage pages, services, doctors, videos, testimonials and leads.</p>
              <form className="admin-login-form" onSubmit={handleLogin}>
                <label className="admin-login-field">
                  Username or email
                  <span className="admin-login-input">
                    <input value={login} onChange={(event) => setLogin(event.target.value)} autoComplete="username" required />
                    <Lock size={22} />
                  </span>
                </label>
                <label className="admin-login-field">
                  Password
                  <span className="admin-login-input">
                    <input type={showPassword ? "text" : "password"} value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} autoComplete="current-password" required />
                    <button type="button" aria-label="Toggle password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={22} /> : <Eye size={22} />}</button>
                  </span>
                </label>
                <button className="admin-login-button" type="submit">Enter Admin Panel</button>
              </form>
              {message && <p className="admin-message">{message}</p>}
              <div className="admin-login-note">
                <b>Default admin:</b> username <b>admin</b>, email <b>admin@twachaclinic.com</b>, password <b>admin@12345678</b>. Change this after first login.
              </div>
            </div>
          </section>
          <section className="admin-login-art" aria-hidden="true" />
        </main>
      </>
    );
  }
  if (!data) return <main className="admin-shell">Loading admin...</main>;
  const current = data;

  function updateSettings(key: string, value: string) {
    mutate({ ...current, settings: { ...current.settings, [key]: value } as SiteData["settings"] } as SiteData);
  }

  function updatePage(index: number, patch: Partial<SitePage>) {
    const pages = [...current.pages];
    pages[index] = { ...pages[index], ...patch };
    mutate({ ...current, pages });
  }

  function updateService(index: number, patch: Partial<Service>) {
    const services = [...current.services];
    services[index] = { ...services[index], ...patch };
    mutate({ ...current, services });
  }

  function updateDoctor(index: number, patch: Partial<Doctor>) {
    const doctors = [...current.doctors];
    doctors[index] = { ...doctors[index], ...patch };
    mutate({ ...current, doctors });
  }

  function updateTestimonial(index: number, patch: Partial<Testimonial>) {
    const testimonials = [...current.testimonials];
    testimonials[index] = { ...testimonials[index], ...patch };
    mutate({ ...current, testimonials });
  }

  function updateVideo(index: number, patch: Partial<VideoItem>) {
    const videos = [...(current.videos || [])];
    videos[index] = { ...videos[index], ...patch };
    mutate({ ...current, videos });
  }

  function updatePageSection(pageIndex: number, sectionIndex: number, patch: Partial<ContentSection>) {
    const page = current.pages[pageIndex];
    updatePage(pageIndex, {
      sections: page.sections.map((item, index) => index === sectionIndex ? { ...item, ...patch } : item)
    });
  }

  function updateServiceSection(serviceIndex: number, sectionIndex: number, patch: Partial<ContentSection>) {
    const service = current.services[serviceIndex];
    const sections = service.sections || [];
    updateService(serviceIndex, {
      sections: sections.map((item, index) => index === sectionIndex ? { ...item, ...patch } : item)
    });
  }

  const activePage = current.pages[selected.pages] || current.pages[0];
  const activeService = current.services[selected.services] || current.services[0];
  const activeDoctor = current.doctors[selected.doctors] || current.doctors[0];
  const activeVideo = (current.videos || [])[selected.videos] || (current.videos || [])[0];
  const activeTestimonial = current.testimonials[selected.testimonials] || current.testimonials[0];

  return (
    <>
    <style>{adminRuntimeCss}</style>
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/assets/img/twacha-logo.png" alt="Twacha Skin Clinic" />
          <div>
            <small>Work Intelligence</small>
            <span>Twacha Admin</span>
          </div>
        </div>
        <nav>
          <div className="admin-nav-group">Overview</div>
          {navItems.map(({ id, label, icon: Icon }) => (
            <div key={id}>
              {id === "pages" && <div className="admin-nav-group">Website</div>}
              {id === "appointments" && <div className="admin-nav-group">Leads</div>}
              <button className={section === id ? "active" : ""} onClick={() => setSection(id)}>
                <Icon size={18} />
                {label}
              </button>
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-logout">
          <button type="button" onClick={logout}><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-top-left">
            <button className="admin-page-menu" type="button" aria-label="Menu"><Menu size={24} /></button>
            <div className="admin-breadcrumb">
              <span>Admin</span>
              <em>/</em>
              <b>{navItems.find((item) => item.id === section)?.label}</b>
            </div>
          </div>
          <div className="admin-top-actions">
            <button className="admin-icon-button" type="button" aria-label="Notifications"><Bell size={22} /><span>{current.appointments.length + current.contactLeads.length}</span></button>
            <button className="primary-btn" onClick={() => save()}><Save size={18} /> Save</button>
            <button className="admin-avatar" type="button" onClick={() => setSection("account")} aria-label="Admin account">{adminUser.username.slice(0, 1).toUpperCase()}</button>
            <button className="secondary-btn" type="button" onClick={logout}><LogOut size={18} /> Logout</button>
          </div>
        </header>
        {message && <p className="admin-message">{message}</p>}

        {section === "dashboard" && (
          <>
            <section className="admin-dashboard-hero">
              <div>
                <span className="eyebrow">Twacha CMS</span>
                <h2>Website content management</h2>
                <p>Manage pages, services, doctors, videos, testimonials and incoming leads from one dynamic admin workspace.</p>
              </div>
              <div className="admin-dashboard-actions">
                <button onClick={() => setSection("services")}><Plus size={22} /></button>
                <button onClick={() => save()}><Save size={22} /></button>
              </div>
            </section>
            <section className="admin-stat-grid">
              {stats.map(({ label, value, icon: Icon }) => (
                <article key={label}>
                  <Icon size={24} />
                  <span>{label}</span>
                  <b>{value}</b>
                </article>
              ))}
            </section>
            <section className="admin-panel-card">
              <h2>Content workflow</h2>
              <p>Use the sidebar to manage every editable website area. Changes stay in this admin draft until you press Save with the admin password.</p>
              <div className="admin-quick-actions">
                <button onClick={() => setSection("pages")}>Manage pages</button>
                <button onClick={() => setSection("services")}>Manage services</button>
                <button onClick={() => setSection("videos")}>Manage videos</button>
                <button onClick={() => setSection("appointments")}>View appointments</button>
                <button onClick={() => setSection("contactLeads")}>View contact leads</button>
              </div>
            </section>
          </>
        )}

        {section === "settings" && (
          <>
            <section className="admin-settings-hero">
              <div>
                <span className="eyebrow">Admin workspace</span>
                <h2>Settings</h2>
                <p>Manage clinic identity, contact details, SEO defaults, appointment text and global website controls.</p>
              </div>
              <label className="admin-hero-search">
                <Search size={18} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search settings..." />
              </label>
            </section>
            <section className="admin-mini-card-grid">
              <article className="admin-mini-card"><span>Pages</span><b>{current.pages.length}</b><p>Dynamic content pages connected.</p></article>
              <article className="admin-mini-card"><span>Services</span><b>{current.services.length}</b><p>Treatment services managed by admin.</p></article>
              <article className="admin-mini-card"><span>Doctors</span><b>{current.doctors.length}</b><p>Team profiles available on site.</p></article>
              <article className="admin-mini-card"><span>Videos</span><b>{current.videos?.length || 0}</b><p>YouTube and Instagram resources.</p></article>
              <article className="admin-mini-card"><span>Appointments</span><b>{current.appointments.length}</b><p>Booking form enquiries.</p></article>
              <article className="admin-mini-card"><span>Contact Leads</span><b>{current.contactLeads.length}</b><p>Contact page messages.</p></article>
            </section>
            <section className="admin-panel-card">
              <div className="admin-editor-head">
                <div>
                  <span className="eyebrow">Storefront controls</span>
                  <h2>Global site settings</h2>
                </div>
              </div>
              <div className="admin-form-grid">
                {Object.entries(current.settings)
                  .filter(([key]) => key !== "adminPassword")
                  .filter(([key]) => !query.trim() || key.toLowerCase().includes(query.trim().toLowerCase()))
                  .map(([key, value]) => (
                    <label key={key} className={String(value).length > 90 ? "wide-field" : ""}>
                      {key}
                      <textarea rows={key.toLowerCase().includes("text") || key.toLowerCase().includes("subtitle") ? 4 : 2} value={String(value)} onChange={(event) => updateSettings(key, event.target.value)} />
                    </label>
                  ))}
              </div>
            </section>
          </>
        )}

        {section === "pages" && (
          <CrudShell
            title="Pages"
            query={query}
            onQuery={setQuery}
            onAdd={() => {
              const pages = [...current.pages, { id: nextId(current.pages), slug: "new-page", title: "New Page", eyebrow: "Page", excerpt: "", image: "", sections: [], metaTitle: "", metaDescription: "", active: true }];
              mutate({ ...current, pages });
              selectAndOpen({ pages: pages.length - 1 });
            }}
            list={filterByQuery(current.pages).map(({ item, index }) => ({
              id: item.id,
              title: item.title,
              subtitle: item.slug,
              active: item.active,
              selected: selected.pages === index,
              viewHref: `/${item.slug}`,
              onClick: () => selectAndOpen({ pages: index }),
              onDelete: () => {
                mutate({ ...current, pages: current.pages.filter((_, pageIndex) => pageIndex !== index) });
                setSelected({ ...selected, pages: 0 });
              }
            }))}
          >
            {activePage && (
              <PageEditor
                page={activePage}
                onChange={(patch) => updatePage(selected.pages, patch)}
                onDelete={() => {
                  mutate({ ...current, pages: current.pages.filter((_, index) => index !== selected.pages) });
                  setSelected({ ...selected, pages: 0 });
                }}
                onSectionChange={(index, patch) => updatePageSection(selected.pages, index, patch)}
                onSectionAdd={() => updatePage(selected.pages, { sections: [...activePage.sections, blankSection()] })}
                onSectionDelete={(index) => updatePage(selected.pages, { sections: activePage.sections.filter((_, i) => i !== index) })}
              />
            )}
          </CrudShell>
        )}

        {section === "services" && (
          <CrudShell
            title="Services"
            query={query}
            onQuery={setQuery}
            onAdd={() => {
              const services = [...current.services, { id: nextId(current.services), slug: "new-service", title: "New Service", category: "Dermatology", image: "/assets/img/banner/about-img.webp", excerpt: "", content: "", benefits: [], sections: [], detailHtml: "", metaTitle: "", metaDescription: "", active: true }];
              mutate({ ...current, services });
              selectAndOpen({ services: services.length - 1 });
            }}
            list={filterByQuery(current.services).map(({ item, index }) => ({
              id: item.id,
              title: item.title,
              subtitle: item.category,
              active: item.active,
              selected: selected.services === index,
              viewHref: `/services/${item.slug}`,
              onClick: () => selectAndOpen({ services: index }),
              onDelete: () => {
                mutate({ ...current, services: current.services.filter((_, serviceIndex) => serviceIndex !== index) });
                setSelected({ ...selected, services: 0 });
              }
            }))}
          >
            {activeService && (
              <ServiceEditor
                service={activeService}
                onChange={(patch) => updateService(selected.services, patch)}
                onDelete={() => {
                  mutate({ ...current, services: current.services.filter((_, index) => index !== selected.services) });
                  setSelected({ ...selected, services: 0 });
                }}
                onSectionChange={(index, patch) => updateServiceSection(selected.services, index, patch)}
                onSectionAdd={() => updateService(selected.services, { sections: [...(activeService.sections || []), blankSection()] })}
                onSectionDelete={(index) => updateService(selected.services, { sections: (activeService.sections || []).filter((_, i) => i !== index) })}
              />
            )}
          </CrudShell>
        )}

        {section === "doctors" && (
          <CrudShell
            title="Doctors"
            query={query}
            onQuery={setQuery}
            onAdd={() => {
              const doctors = [...current.doctors, { id: nextId(current.doctors), slug: "new-doctor", name: "New Doctor", title: "Dermatologist", image: "/assets/img/team/Doctor-Image.webp", summary: "", highlights: [], active: true }];
              mutate({ ...current, doctors });
              selectAndOpen({ doctors: doctors.length - 1 });
            }}
            list={filterByQuery(current.doctors).map(({ item, index }) => ({
              id: item.id,
              title: item.name,
              subtitle: item.title,
              active: item.active,
              selected: selected.doctors === index,
              viewHref: `/doctors/${item.slug}`,
              onClick: () => selectAndOpen({ doctors: index }),
              onDelete: () => {
                mutate({ ...current, doctors: current.doctors.filter((_, doctorIndex) => doctorIndex !== index) });
                setSelected({ ...selected, doctors: 0 });
              }
            }))}
          >
            {activeDoctor && (
              <DoctorEditor
                doctor={activeDoctor}
                onChange={(patch) => updateDoctor(selected.doctors, patch)}
                onDelete={() => {
                  mutate({ ...current, doctors: current.doctors.filter((_, index) => index !== selected.doctors) });
                  setSelected({ ...selected, doctors: 0 });
                }}
              />
            )}
          </CrudShell>
        )}

        {section === "videos" && (
          <CrudShell
            title="Videos"
            query={query}
            onQuery={setQuery}
            onAdd={() => {
              const videos = [...(current.videos || []), { id: `video-${Date.now()}`, platform: "youtube" as const, title: "New Video", url: "", embedUrl: "", thumbnail: "" }];
              mutate({ ...current, videos });
              selectAndOpen({ videos: videos.length - 1 });
            }}
            list={filterByQuery(current.videos || []).map(({ item, index }) => ({
              id: index,
              title: item.title,
              subtitle: item.platform,
              active: true,
              selected: selected.videos === index,
              viewHref: item.url,
              onClick: () => selectAndOpen({ videos: index }),
              onDelete: () => {
                mutate({ ...current, videos: (current.videos || []).filter((_, videoIndex) => videoIndex !== index) });
                setSelected({ ...selected, videos: 0 });
              }
            }))}
          >
            {activeVideo && (
              <VideoEditor
                video={activeVideo}
                onChange={(patch) => updateVideo(selected.videos, patch)}
                onDelete={() => {
                  mutate({ ...current, videos: (current.videos || []).filter((_, index) => index !== selected.videos) });
                  setSelected({ ...selected, videos: 0 });
                }}
              />
            )}
          </CrudShell>
        )}

        {section === "testimonials" && (
          <CrudShell
            title="Testimonials"
            query={query}
            onQuery={setQuery}
            onAdd={() => {
              const testimonials = [...current.testimonials, { id: nextId(current.testimonials), name: "New Testimonial", note: "", rating: 5, active: true }];
              mutate({ ...current, testimonials });
              selectAndOpen({ testimonials: testimonials.length - 1 });
            }}
            list={filterByQuery(current.testimonials).map(({ item, index }) => ({
              id: item.id,
              title: item.name,
              subtitle: `${item.rating} star`,
              active: item.active,
              selected: selected.testimonials === index,
              onClick: () => selectAndOpen({ testimonials: index }),
              onDelete: () => {
                mutate({ ...current, testimonials: current.testimonials.filter((_, testimonialIndex) => testimonialIndex !== index) });
                setSelected({ ...selected, testimonials: 0 });
              }
            }))}
          >
            {activeTestimonial && (
              <TestimonialEditor
                testimonial={activeTestimonial}
                onChange={(patch) => updateTestimonial(selected.testimonials, patch)}
                onDelete={() => {
                  mutate({ ...current, testimonials: current.testimonials.filter((_, index) => index !== selected.testimonials) });
                  setSelected({ ...selected, testimonials: 0 });
                }}
              />
            )}
          </CrudShell>
        )}

        {section === "appointments" && (
          <section className="admin-panel-card">
            <div className="admin-title-row">
              <div>
                <span className="eyebrow">Booking leads</span>
                <h2>Appointment enquiries</h2>
              </div>
              <button className="secondary-btn" type="button" onClick={reloadData}><Activity size={16} /> Refresh appointments</button>
            </div>
            <div className="lead-list">
              {current.appointments.length === 0 && <p>No appointment enquiries yet. New booking form submissions will show here.</p>}
              {current.appointments.map((lead) => (
                <article key={lead.id}>
                  <div>
                    <b>{lead.name}</b>
                    <span>{lead.phone}</span>
                    {lead.email && <small>{lead.email}</small>}
                  </div>
                  <div>
                    <p><b>{lead.service || "General consultation"}</b>{lead.doctor && ` with ${lead.doctor}`}</p>
                    <p>{lead.message || "No message provided"}</p>
                    <small>{new Date(lead.createdAt).toLocaleString()}</small>
                  </div>
                  <button className="danger-btn" onClick={() => mutate({ ...current, appointments: current.appointments.filter((item) => item.id !== lead.id) })}><Trash2 size={16} /> Delete</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {section === "contactLeads" && (
          <section className="admin-panel-card">
            <div className="admin-title-row">
              <div>
                <span className="eyebrow">Contact leads</span>
                <h2>Contact form messages</h2>
              </div>
              <button className="secondary-btn" type="button" onClick={reloadData}><Activity size={16} /> Refresh contact leads</button>
            </div>
            <div className="lead-list">
              {current.contactLeads.length === 0 && <p>No contact leads yet. New contact page form submissions will show here.</p>}
              {current.contactLeads.map((lead) => (
                <article key={lead.id}>
                  <div>
                    <b>{lead.name}</b>
                    <span>{lead.phone}</span>
                    {lead.email && <small>{lead.email}</small>}
                  </div>
                  <div>
                    <p>{lead.message || "No message provided"}</p>
                    <small>{new Date(lead.createdAt).toLocaleString()}</small>
                  </div>
                  <button className="danger-btn" onClick={() => mutate({ ...current, contactLeads: current.contactLeads.filter((item) => item.id !== lead.id) })}><Trash2 size={16} /> Delete</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {section === "account" && (
          <div className="admin-access-page">
            <section className="admin-settings-hero">
              <div>
                <span className="eyebrow">Admin workspace</span>
                <h2>Access</h2>
                <p>Manage your admin password, account role and future admin panel user access.</p>
              </div>
              <button className="secondary-btn" type="button" onClick={logout}><LogOut size={16} /> Sign Out</button>
            </section>
            <section className="admin-access-security">
              <div>
                <span className="eyebrow">Account security</span>
                <h2>Update your own admin password</h2>
                <p>This changes the password for the currently signed-in admin account only.</p>
                <span className="admin-access-pill"><Lock size={14} /> {adminUser.email}</span>
              </div>
              <form className="admin-access-form" onSubmit={changePassword}>
                <label>
                  Current password
                  <span className="admin-access-input">
                    <input type="password" placeholder="Enter current password" value={passwordForm.current} onChange={(event) => setPasswordForm({ ...passwordForm, current: event.target.value })} required />
                    <Eye size={16} />
                  </span>
                </label>
                <label>
                  New password
                  <span className="admin-access-input">
                    <input type="password" placeholder="Enter new password" value={passwordForm.next} onChange={(event) => setPasswordForm({ ...passwordForm, next: event.target.value })} required />
                    <Eye size={16} />
                  </span>
                </label>
                <label>
                  Confirm password
                  <span className="admin-access-input">
                    <input type="password" placeholder="Re-enter new password" value={passwordForm.confirm} onChange={(event) => setPasswordForm({ ...passwordForm, confirm: event.target.value })} required />
                    <Eye size={16} />
                  </span>
                </label>
                <p className="admin-access-help">Keep this different from your old password and confirm it before saving.</p>
                <button className="primary-btn" type="submit"><KeyRound size={16} /> Update Password</button>
              </form>
            </section>
            <section className="admin-access-stat-grid">
              <article className="admin-access-stat"><span>Role</span><b>1</b><p>Configured Twacha admin role.</p></article>
              <article className="admin-access-stat"><span>Modules</span><b>8</b><p>Admin content modules currently active.</p></article>
              <article className="admin-access-stat"><span>Coverage</span><b>{current.pages.length + current.services.length + current.doctors.length}</b><p>Pages, services and doctors managed.</p></article>
            </section>
            <section className="admin-access-card-grid">
              <article className="admin-access-card">
                <span>Role studio</span>
                <h3>Current access blueprint</h3>
                <p>{adminUser.username} can manage website settings, pages, services, doctors, videos, testimonials and incoming leads.</p>
                <div className="admin-chip-row">
                  <i>Settings.write</i>
                  <i>Pages.write</i>
                  <i>Services.write</i>
                  <i>Leads.read</i>
                  <i>Media.upload</i>
                </div>
              </article>
              <article className="admin-access-card">
                <span>Team access</span>
                <h3>Create admin-panel users</h3>
                <p>This layout is ready for adding more admin users later with email login and role permissions.</p>
                <div className="admin-chip-row">
                  <i>Content manager</i>
                  <i>Lead manager</i>
                  <i>Super admin</i>
                </div>
              </article>
            </section>
          </div>
        )}
      </section>
    </main>
    </>
  );
}

function CrudShell({ title, query, onQuery, onAdd, list, children }: {
  title: string;
  query: string;
  onQuery: (value: string) => void;
  onAdd: () => void;
  list: { id: number; title: string; subtitle: string; active: boolean; selected: boolean; viewHref?: string; onClick: () => void; onDelete: () => void }[];
  children: React.ReactNode;
}) {
  function handleAdd() {
    onQuery("");
    onAdd();
  }

  return (
    <section className="admin-crud">
      <div className="admin-crud-hero">
        <div>
          <span className="eyebrow">{title} workspace</span>
          <h2>Manage {title.toLowerCase()}</h2>
          <p>Add, edit, publish and keep website content updated from this dedicated admin workspace.</p>
        </div>
        <div className="admin-crud-actions">
          <button className="secondary-btn" type="button" onClick={() => onQuery("")}>Clear Search</button>
          <button className="primary-btn" type="button" onClick={handleAdd}><Plus size={18} /> Add {title.slice(0, -1) || title}</button>
        </div>
      </div>
      <div className="admin-list-panel admin-filter-strip">
        <div className="admin-list-head">
          <div>
            <span className="eyebrow">{title} filters</span>
            <h2>Find content fast</h2>
            <p>Search the current module, select an item, then use the full-width editor below.</p>
          </div>
          <button className="secondary-btn" type="button" onClick={handleAdd}><Plus size={16} /> Add</button>
        </div>
        <label className="admin-search">
          <Search size={16} />
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} />
        </label>
        <div className="admin-data-table-wrap">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>{title.slice(0, -1) || title}</th>
                <th>Category / Slug</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr>
                  <td colSpan={4}>No records found.</td>
                </tr>
              )}
              {list.map((item) => (
                <tr key={item.id} className={item.selected ? "selected" : ""}>
                  <td>
                    <button className="admin-table-title" type="button" onClick={item.onClick}>{item.title}</button>
                  </td>
                  <td>{item.subtitle}</td>
                  <td><span className={item.active ? "admin-status active" : "admin-status draft"}>{item.active ? "Active" : "Draft"}</span></td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" title="Edit" onClick={item.onClick}><PencilLine size={17} /></button>
                      {item.viewHref ? (
                        <a title="View" href={item.viewHref} target="_blank" rel="noreferrer"><Eye size={17} /></a>
                      ) : (
                        <button type="button" title="View" onClick={item.onClick}><Eye size={17} /></button>
                      )}
                      <button type="button" title="Delete" className="delete" onClick={item.onDelete}><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div id="admin-editor-panel" className="admin-editor-panel">{children}</div>
    </section>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="admin-toggle"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /> Active</label>;
}

function PageEditor({ page, onChange, onDelete, onSectionChange, onSectionAdd, onSectionDelete }: {
  page: SitePage;
  onChange: (patch: Partial<SitePage>) => void;
  onDelete: () => void;
  onSectionChange: (index: number, patch: Partial<ContentSection>) => void;
  onSectionAdd: () => void;
  onSectionDelete: (index: number) => void;
}) {
  return (
    <EditorFrame title={page.title} onDelete={onDelete} active={page.active} onActive={(active) => onChange({ active })}>
      <div className="admin-form-grid">
        <Field label="Title" value={page.title} onChange={(title) => onChange({ title })} />
        <Field label="Slug" value={page.slug} onChange={(slug) => onChange({ slug })} />
        <Field label="Eyebrow" value={page.eyebrow} onChange={(eyebrow) => onChange({ eyebrow })} />
        <ImageUploadField label="Page image" value={page.image} onChange={(image) => onChange({ image })} />
        <RichTextEditor label="Excerpt" value={page.excerpt} onChange={(excerpt) => onChange({ excerpt })} rows={4} className="wide-field" />
        <Field label="Meta title" value={page.metaTitle} onChange={(metaTitle) => onChange({ metaTitle })} />
        <RichTextEditor label="Meta description" value={page.metaDescription} onChange={(metaDescription) => onChange({ metaDescription })} rows={3} className="wide-field" />
      </div>
      <SectionsEditor sections={page.sections} onAdd={onSectionAdd} onChange={onSectionChange} onDelete={onSectionDelete} />
    </EditorFrame>
  );
}

function ServiceEditor({ service, onChange, onDelete, onSectionChange, onSectionAdd, onSectionDelete }: {
  service: Service;
  onChange: (patch: Partial<Service>) => void;
  onDelete: () => void;
  onSectionChange: (index: number, patch: Partial<ContentSection>) => void;
  onSectionAdd: () => void;
  onSectionDelete: (index: number) => void;
}) {
  return (
    <EditorFrame title={service.title} onDelete={onDelete} active={service.active} onActive={(active) => onChange({ active })}>
      <div className="admin-form-grid">
        <Field label="Title" value={service.title} onChange={(title) => onChange({ title })} />
        <Field label="Slug" value={service.slug} onChange={(slug) => onChange({ slug })} />
        <Field label="Category" value={service.category} onChange={(category) => onChange({ category })} />
        <ImageUploadField label="Service image" value={service.image} onChange={(image) => onChange({ image })} />
        <RichTextEditor label="Excerpt" value={service.excerpt} onChange={(excerpt) => onChange({ excerpt })} rows={4} className="wide-field" />
        <RichTextEditor label="Main content" value={service.content} onChange={(content) => onChange({ content })} rows={6} className="wide-field" />
        <RichTextEditor label="Benefits, one per line" value={lines(service.benefits)} onChange={(value) => onChange({ benefits: splitLines(value) })} rows={6} className="wide-field" />
        <HtmlVisualEditor label="Service detail page content" value={service.detailHtml || ""} onChange={(detailHtml) => onChange({ detailHtml })} />
        <Field label="Meta title" value={service.metaTitle} onChange={(metaTitle) => onChange({ metaTitle })} />
        <RichTextEditor label="Meta description" value={service.metaDescription} onChange={(metaDescription) => onChange({ metaDescription })} rows={3} className="wide-field" />
      </div>
      <SectionsEditor sections={service.sections || []} onAdd={onSectionAdd} onChange={onSectionChange} onDelete={onSectionDelete} />
    </EditorFrame>
  );
}

function DoctorEditor({ doctor, onChange, onDelete }: { doctor: Doctor; onChange: (patch: Partial<Doctor>) => void; onDelete: () => void }) {
  return (
    <EditorFrame title={doctor.name} onDelete={onDelete} active={doctor.active} onActive={(active) => onChange({ active })}>
      <div className="admin-form-grid">
        <Field label="Name" value={doctor.name} onChange={(name) => onChange({ name })} />
        <Field label="Slug" value={doctor.slug} onChange={(slug) => onChange({ slug })} />
        <Field label="Title" value={doctor.title} onChange={(title) => onChange({ title })} />
        <ImageUploadField label="Doctor image" value={doctor.image} onChange={(image) => onChange({ image })} />
        <RichTextEditor label="Summary" value={doctor.summary} onChange={(summary) => onChange({ summary })} rows={5} className="wide-field" />
        <RichTextEditor label="Highlights, one per line" value={lines(doctor.highlights)} onChange={(value) => onChange({ highlights: splitLines(value) })} rows={7} className="wide-field" />
      </div>
    </EditorFrame>
  );
}

function VideoEditor({ video, onChange, onDelete }: { video: VideoItem; onChange: (patch: Partial<VideoItem>) => void; onDelete: () => void }) {
  return (
    <EditorFrame title={video.title} onDelete={onDelete} active onActive={() => undefined}>
      <div className="admin-form-grid">
        <Field label="Title" value={video.title} onChange={(title) => onChange({ title })} />
        <label>
          Platform
          <select value={video.platform} onChange={(event) => onChange({ platform: event.target.value as VideoItem["platform"] })}>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
          </select>
        </label>
        <Field label="Video URL" value={video.url} onChange={(url) => onChange({ url })} />
        <Field label="Embed URL" value={video.embedUrl || ""} onChange={(embedUrl) => onChange({ embedUrl })} />
        <ImageUploadField label="Thumbnail image" value={video.thumbnail || ""} onChange={(thumbnail) => onChange({ thumbnail })} />
        <Field label="Service slug" value={video.serviceSlug || ""} onChange={(serviceSlug) => onChange({ serviceSlug })} />
      </div>
    </EditorFrame>
  );
}

function TestimonialEditor({ testimonial, onChange, onDelete }: { testimonial: Testimonial; onChange: (patch: Partial<Testimonial>) => void; onDelete: () => void }) {
  return (
    <EditorFrame title={testimonial.name} onDelete={onDelete} active={testimonial.active} onActive={(active) => onChange({ active })}>
      <div className="admin-form-grid">
        <Field label="Name" value={testimonial.name} onChange={(name) => onChange({ name })} />
        <label>
          Rating
          <input type="number" min={1} max={5} value={testimonial.rating} onChange={(event) => onChange({ rating: Number(event.target.value) })} />
        </label>
        <RichTextEditor label="Note" value={testimonial.note} onChange={(note) => onChange({ note })} rows={6} className="wide-field" />
      </div>
    </EditorFrame>
  );
}

function EditorFrame({ title, active, onActive, onDelete, children }: {
  title: string;
  active: boolean;
  onActive: (active: boolean) => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-panel-card">
      <div className="admin-editor-head">
        <div>
          <span className="eyebrow">Editing</span>
          <h2>{title}</h2>
        </div>
        <div className="admin-editor-actions">
          <Toggle checked={active} onChange={onActive} />
          <button className="danger-btn" onClick={onDelete}><Trash2 size={16} /> Delete</button>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, textarea, rows = 2, className = "" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  rows?: number;
  className?: string;
}) {
  return (
    <label className={className}>
      {label}
      {textarea ? (
        <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function RichTextEditor({ label, value, onChange, rows = 6, className = "" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
}) {
  function appendText(text: string) {
    onChange(value ? `${value}\n${text}` : text);
  }

  return (
    <label className={`${className} admin-rich-editor`}>
      {label}
      <span className="admin-editor-toolbar">
        <button type="button" onClick={() => appendText("\nNew paragraph")}>Paragraph</button>
        <button type="button" onClick={() => appendText("- List item")}>List</button>
        <button type="button" onClick={() => appendText("## Heading")}>Heading</button>
      </span>
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function HtmlVisualEditor({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [sourceMode, setSourceMode] = useState(false);

  useEffect(() => {
    if (!sourceMode && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "<p></p>";
    }
  }, [sourceMode, value]);

  function syncFromEditor() {
    onChange(editorRef.current?.innerHTML || "");
  }

  function runCommand(command: string, argument?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    syncFromEditor();
  }

  function createLink() {
    const href = window.prompt("Enter link URL");
    if (href) runCommand("createLink", href);
  }

  function insertImage() {
    const src = window.prompt("Enter image URL, for example /uploads/image.webp");
    if (src) runCommand("insertImage", src);
  }

  return (
    <div className="admin-html-editor">
      <div className="admin-html-editor-title">
        <span>{label}</span>
        <span>Visual editor for old service page content</span>
      </div>
      <div className="admin-html-editor-toolbar" role="toolbar" aria-label={`${label} toolbar`}>
        <button type="button" className={!sourceMode ? "active" : ""} onClick={() => setSourceMode(false)}>Visual</button>
        <button type="button" className={sourceMode ? "active" : ""} onClick={() => setSourceMode(true)}>Source</button>
        <button type="button" onClick={() => runCommand("formatBlock", "H2")}>H2</button>
        <button type="button" onClick={() => runCommand("formatBlock", "H3")}>H3</button>
        <button type="button" onClick={() => runCommand("formatBlock", "P")}>Paragraph</button>
        <button type="button" onClick={() => runCommand("bold")}>Bold</button>
        <button type="button" onClick={() => runCommand("italic")}>Italic</button>
        <button type="button" onClick={() => runCommand("insertUnorderedList")}>Bullet list</button>
        <button type="button" onClick={() => runCommand("insertOrderedList")}>Number list</button>
        <button type="button" onClick={createLink}>Link</button>
        <button type="button" onClick={insertImage}>Image</button>
      </div>
      {sourceMode ? (
        <textarea
          className="admin-html-editor-source"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
        />
      ) : (
        <div
          ref={editorRef}
          className="admin-html-editor-canvas"
          contentEditable
          suppressContentEditableWarning
          onInput={syncFromEditor}
          onBlur={syncFromEditor}
        />
      )}
      <p className="admin-html-editor-help">
        Use Visual mode for normal text edits. Use Source only when you need to adjust exact old-page HTML classes or layout markup.
      </p>
    </div>
  );
}

function ImageUploadField({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      onChange(result.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="admin-image-field">
      {label}
      <div className="admin-image-uploader">
        {value ? <img src={value} alt={label} /> : <span className="admin-image-placeholder">No image</span>}
        <div>
          <div className="admin-image-actions">
            <span className="secondary-btn admin-file-button">
              {uploading ? "Uploading..." : "Upload image"}
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void upload(file);
                  event.target.value = "";
                }}
              />
            </span>
            {value && <button className="danger-btn" type="button" onClick={() => onChange("")}>Remove</button>}
          </div>
          {value && <p className="admin-image-url">{value}</p>}
          {error && <p className="admin-message">{error}</p>}
        </div>
      </div>
    </label>
  );
}

function SectionsEditor({ sections, onAdd, onChange, onDelete }: {
  sections: ContentSection[];
  onAdd: () => void;
  onChange: (index: number, patch: Partial<ContentSection>) => void;
  onDelete: (index: number) => void;
}) {
  return (
    <div className="admin-sections-editor">
      <div className="admin-title-row">
        <h3>Content sections</h3>
        <button className="secondary-btn" onClick={onAdd}><Plus size={16} /> Add section</button>
      </div>
      {sections.length === 0 && <p>No sections yet.</p>}
      {sections.map((section, index) => (
        <article key={`${section.heading}-${index}`} className="admin-section-edit">
          <Field label="Heading" value={section.heading} onChange={(heading) => onChange(index, { heading })} />
          <ImageUploadField label="Section image" value={section.image || ""} onChange={(image) => onChange(index, { image })} />
          <RichTextEditor label="Body, one paragraph per line" value={lines(section.body)} onChange={(value) => onChange(index, { body: splitLines(value) })} rows={8} />
          <button className="danger-btn" onClick={() => onDelete(index)}><Trash2 size={16} /> Delete section</button>
        </article>
      ))}
    </div>
  );
}

