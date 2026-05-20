"use client";

import Link from "next/link";
import { CalendarDays, ChevronDown, Facebook, Instagram, Mail, Menu, Phone, Sparkles, Youtube } from "lucide-react";
import { useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { aboutMenu, conditionMenu, treatmentMenu } from "@/lib/menu";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const socials = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/twachaclinic?mibextid=LQQJ4d",
      icon: <Facebook size={22} />
    },
    {
      label: "YouTube",
      href: "https://youtube.com/@twachaclinics?si=HCBpdIv35sIrPq8q",
      icon: <Youtube size={22} />
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/twachaclinics/profilecard/?igsh=MWllZXFmOXI0a2swaA==",
      icon: <Instagram size={22} />
    },
    {
      label: "Threads",
      href: "https://www.threads.net/@twachaskin?invite=0",
      icon: <span>Th</span>
    }
  ];

  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="top-contact">
          <a href={`tel:${settings.phone.replaceAll(" ", "")}`}><Phone size={14} /> {settings.phone}</a>
          <a href={`mailto:${settings.email}`}><Mail size={14} /> {settings.email}</a>
          <Link href="/services/3d-skin-analyzer"><Sparkles size={14} /> 3D Skin Analyzer</Link>
        </div>
        <span>Twacha has been ranked among the top skin and hair clinics in Delhi NCR between 2018-2024.</span>
      </div>
      <nav className="nav">
        <Link className="brand" href="/">
          <img src="/assets/img/twacha-logo.png" alt="Twacha Skin Clinic" />
        </Link>
        <div className={`nav-links${isMenuOpen ? " is-open" : ""}`}>
          <Link className="nav-icon-link" href="/" onClick={closeMenu}>Home</Link>
          <div className="dropdown">
            <button type="button"><span>About Us</span> <ChevronDown size={14} /></button>
            <div className="dropdown-panel compact-menu">
              {aboutMenu.map((item) => <Link key={item.label} href={item.href} onClick={closeMenu}>{item.label}</Link>)}
            </div>
          </div>
          <div className="dropdown">
            <button type="button"><span>Treatments</span> <ChevronDown size={14} /></button>
            <div className="dropdown-panel mega-menu">
              {treatmentMenu.map((group) => (
                <div key={group.title}>
                  <h3>{group.title}</h3>
                  {group.links.map((item) => <Link key={`${group.title}-${item.label}`} href={item.href} onClick={closeMenu}>{item.label}</Link>)}
                </div>
              ))}
            </div>
          </div>
          <div className="dropdown">
            <button type="button"><span>Conditions</span> <ChevronDown size={14} /></button>
            <div className="dropdown-panel compact-menu">
              {conditionMenu.map((item) => <Link key={item.label} href={item.href} onClick={closeMenu}>{item.label}</Link>)}
            </div>
          </div>
          <div className="dropdown">
            <button type="button"><span>Resources</span> <ChevronDown size={14} /></button>
            <div className="dropdown-panel compact-menu">
              <Link href="/videos" onClick={closeMenu}>Videos</Link>
              <Link href="/gallery" onClick={closeMenu}>Gallery</Link>
            </div>
          </div>
          <Link className="nav-icon-link" href="/contact" onClick={closeMenu}>Contact Us</Link>
        </div>
        <div className="nav-actions">
          <a className="icon-link" href={`tel:${settings.phone.replaceAll(" ", "")}`} aria-label="Call clinic">
            <Phone size={18} />
          </a>
          <Link className="primary-btn small" href="/book-appointment">
            <CalendarDays size={18} />
            Appointment
          </Link>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>
      <aside className="floating-social-badge" aria-label="Twacha social links">
        {socials.map((social) => (
          <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
            {social.icon}
          </a>
        ))}
      </aside>
    </header>
  );
}
