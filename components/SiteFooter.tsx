import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import type { Service, SiteSettings } from "@/lib/types";

export function SiteFooter({ settings, services }: { settings: SiteSettings; services: Service[] }) {
  const treatments = [
    ["Hydrafacial", "/services/hydrafacial"],
    ["Dermal Fillers", "/services/dermal-fillers"],
    ["PRP", "/services/prp"],
    ["Derma Clean", "/services/derma-clean"],
    ["Anti-Wrinkle Treatment", "/services/anti-wrinkle-treatment"],
    ["Chemical Peels", "/services/chemical-peels"],
    ["LHR", "/services/laser-hair-reduction"],
    ["Medifacials", "/services/medifacial"],
    ["HIFU", "/services/hifu"],
    ["Eyebrow Lift", "/services/eyebrow-lift"]
  ];
  const conditions = [
    ["Acne/Pimples", "/services/acne-pimple-conditions"],
    ["Hyper Pigmentation", "/services/hyperpigmentation-condition"],
    ["Melasma", "/services/melasma-condition"],
    ["Wrinkles", "/services/wrinkle"],
    ["Ageing", "/services/aging"],
    ["Aesthetic/ Beauty Enhancement", "/services/aesthetic-and-beauty-enhancement"],
    ["Dermatological", "/services/dermatologic-conditions"],
    ["Hair Fall/Loss", "/services/hairfall"],
    ["Excessive Hair Growth", "/services/excessive-hair-growth"]
  ];

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-about">
          <h3>About Twacha Skin Clinic</h3>
          <p>
            At TWACHA, our goal is to provide the best skin care that you need. Our doctors have years of experience in
            dermatology and aesthetic skin care treatments. TWACHA was created 17 years ago with the singular aim of
            being a centre of skin care excellence in India. Spread over 3000 sq feet in two floors in a posh Delhi
            suburb, TWACHA boasts of one of the best LASER and Aesthetic equipment range in North India. The aesthetic
            technicians are well trained to provide you with safe and effective skin care therapies.
          </p>
        </div>
        <div>
          <h3>Treatments</h3>
          {treatments.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </div>
        <div>
          <h3>Conditions</h3>
          {conditions.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </div>
        <div className="footer-contact">
          <h3>Get In Touch</h3>
          <a href="tel:+919350303663"><Phone size={16} /> +91-93503-03663</a>
          <a href="mailto:contact@twacha.in"><Mail size={16} /> contact@twacha.in</a>
          <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer">
            <MapPin size={16} /> Twacha Skin Clinic, A Unit of MaxDermCare Skin and Laser Pvt. Ltd. Sector 12A, Dwarka, New Delhi
          </a>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224373.48742672353!2d77.01086404428206!3d28.514589312974216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03cce1261ab7%3A0xba873ba8bfdeb311!2sTwacha%20Skin%20%26%20Hair%20Clinic!5e0!3m2!1sen!2sin!4v1718190653652!5m2!1sen!2sin"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Twacha Skin Clinic location"
          />
        </div>
      </div>
      <p className="disclaimer">
        <b>Disclaimer: </b>All the information on this website - twachaclinic.com - is published in good faith and for
        general information purpose only. Twacha Skin Clinic does not make any warranties about the completeness,
        reliability and accuracy of this information. Any action you take upon the information you find on this website
        (Twacha Skin Clinic), is strictly at your own risk. Twacha Skin Clinic will not be liable for any losses and/or
        damages in connection with the use of our website.
      </p>
      <div className="copyright">
        <span>Copyright 2025 Twacha Skin Clinic. All Rights Reserved</span>
        <div className="footer-legal-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms & Conditions</Link>
        </div>
        <div className="footer-socials">
          <a href="https://www.facebook.com/twachaclinic?mibextid=LQQJ4d" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a>
          <a href="https://www.threads.net/@twachaskin?invite=0" target="_blank" rel="noreferrer" aria-label="Threads">Th</a>
          <a href="https://www.instagram.com/twachaclinics/profilecard/?igsh=MWllZXFmOXI0a2swaA==" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a>
          <a href="https://youtube.com/@twachaclinics?si=HCBpdIv35sIrPq8q" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={17} /></a>
        </div>
      </div>
    </footer>
  );
}
