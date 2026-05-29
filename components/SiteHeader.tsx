"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ChevronDown, Facebook, Instagram, Mail, Menu, Phone, Sparkles, Youtube } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { aboutMenu, conditionMenu, resourcesMenu, treatmentMenu } from "@/lib/menu";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const blurHeaderFocus = useCallback(() => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && headerRef.current?.contains(activeElement)) {
      activeElement.blur();
    }
  }, []);

  const closeDropdowns = useCallback(() => {
    setOpenMenu(null);
    blurHeaderFocus();
  }, [blurHeaderFocus]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    closeDropdowns();
  }, [closeDropdowns]);

  const toggleMenu = (menu: string) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };
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

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeMenu]);

  useEffect(() => {
    const shouldLockPage = openMenu === "treatments" && window.matchMedia("(min-width: 1181px)").matches;
    const previousOverflow = document.body.style.overflow;

    if (shouldLockPage) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openMenu]);

  useEffect(() => {
    if (!openMenu && !isMenuOpen) {
      return;
    }

    let startY = 0;
    const closeOnPageMove = () => closeMenu();
    const handleTouchStart = (event: TouchEvent) => {
      startY = event.touches[0]?.clientY || 0;
    };
    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY || 0;
      if (Math.abs(currentY - startY) > 12) {
        closeOnPageMove();
      }
    };

    window.addEventListener("scroll", closeOnPageMove, { passive: true });
    window.addEventListener("wheel", closeOnPageMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", closeOnPageMove);
      window.removeEventListener("wheel", closeOnPageMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [closeMenu, isMenuOpen, openMenu]);

  return (
    <header className={`site-header${openMenu ? " has-open-menu" : ""}${isMenuOpen ? " is-mobile-open" : ""}`} ref={headerRef} onMouseLeave={closeDropdowns}>
      <div className="top-strip">
        <div className="top-contact">
          <a href={`tel:${settings.phone.replaceAll(" ", "")}`}><Phone size={14} /> {settings.phone}</a>
          <a href={`mailto:${settings.email}`}><Mail size={14} /> {settings.email}</a>
          <Link href="/treatments/3d-skin-analyzer"><Sparkles size={14} /> 3D Skin Analyzer</Link>
        </div>
        <span>Twacha has been ranked among the top skin and hair clinics in Delhi NCR between 2018-2024.</span>
      </div>
      <nav className="nav">
        <Link className="brand" href="/">
          <Image
            src="/assets/img/twacha-logo.png"
            alt="Twacha Skin Clinic"
            width={500}
            height={187}
            sizes="(max-width: 420px) 126px, 178px"
          />
        </Link>
        <div className={`nav-links${isMenuOpen ? " is-open" : ""}`}>
          <Link className="nav-icon-link" href="/" onClick={closeMenu}>Home</Link>
          <div className={`dropdown${openMenu === "about" ? " is-active" : ""}`} onMouseEnter={() => setOpenMenu("about")}>
            <button type="button" aria-expanded={openMenu === "about"} onClick={() => toggleMenu("about")}><span>About</span> <ChevronDown size={14} /></button>
            <div className="dropdown-panel compact-menu">
              {aboutMenu.map((item) => <Link key={item.label} href={item.href} onClick={closeMenu}>{item.label}</Link>)}
            </div>
          </div>
          <div className={`dropdown${openMenu === "treatments" ? " is-active" : ""}`} onMouseEnter={() => setOpenMenu("treatments")}>
            <button type="button" aria-expanded={openMenu === "treatments"} onClick={() => toggleMenu("treatments")}><span>Treatments</span> <ChevronDown size={14} /></button>
            <div className="dropdown-panel mega-menu">
              {treatmentMenu.map((group) => (
                <div key={group.title}>
                  <h3>{group.title}</h3>
                  {group.links.map((item) => <Link key={`${group.title}-${item.label}`} href={item.href} onClick={closeMenu}>{item.label}</Link>)}
                </div>
              ))}
            </div>
          </div>
          <div className={`dropdown${openMenu === "conditions" ? " is-active" : ""}`} onMouseEnter={() => setOpenMenu("conditions")}>
            <button type="button" aria-expanded={openMenu === "conditions"} onClick={() => toggleMenu("conditions")}><span>Conditions</span> <ChevronDown size={14} /></button>
            <div className="dropdown-panel compact-menu">
              {conditionMenu.map((item) => <Link key={item.label} href={item.href} onClick={closeMenu}>{item.label}</Link>)}
            </div>
          </div>
          <div className={`dropdown${openMenu === "resources" ? " is-active" : ""}`} onMouseEnter={() => setOpenMenu("resources")}>
            <button type="button" aria-expanded={openMenu === "resources"} onClick={() => toggleMenu("resources")}><span>Patient Resources</span> <ChevronDown size={14} /></button>
            <div className="dropdown-panel compact-menu">
              {resourcesMenu.map((item) => <Link key={item.label} href={item.href} onClick={closeMenu}>{item.label}</Link>)}
            </div>
          </div>
          <Link className="nav-icon-link" href="/contact" onClick={closeMenu}>Contact</Link>
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
