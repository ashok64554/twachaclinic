/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      { source: "/book", destination: "/book-appointment", permanent: true },
      { source: "/patient-resources/videos", destination: "/videos", permanent: true },
      { source: "/patient-resources/gallery", destination: "/gallery", permanent: true },
      { source: "/resources/videos", destination: "/videos", permanent: true },
      { source: "/resources/gallery", destination: "/gallery", permanent: true },
      { source: "/services/chemical-peels", destination: "/treatments/face/chemical-peels", permanent: true },
      { source: "/services/derma-clean", destination: "/treatments/face/derma-clean", permanent: true },
      { source: "/services/hydrafacial", destination: "/treatments/face/hydrafacial", permanent: true },
      { source: "/services/microneedling-radiofrequency", destination: "/treatments/face/mnrf", permanent: true },
      { source: "/services/hifu", destination: "/treatments/face/hifu", permanent: true },
      { source: "/services/medifacial", destination: "/treatments/face/medifacials", permanent: true },
      { source: "/services/intense-pulsed-light", destination: "/treatments/face/photofacial", permanent: true },
      { source: "/services/microblading", destination: "/treatments/face/microblading", permanent: true },
      { source: "/services/double-chin", destination: "/treatments/face/double-chin", permanent: true },
      { source: "/services/prp", destination: "/treatments/hair/prp", permanent: true },
      { source: "/services/qr-678", destination: "/treatments/hair/qr678", permanent: true },
      { source: "/services/gfc", destination: "/treatments/hair/gfc", permanent: true },
      { source: "/services/hair-drip", destination: "/treatments/hair/hair-drip", permanent: true },
      { source: "/services/regenerative-skin-therapy", destination: "/treatments/hair/regenerative-skin-therapy", permanent: true },
      { source: "/services/mesotherapy", destination: "/treatments/hair/mesotherapy-for-hair", permanent: true },
      { source: "/services/laser-hair-reduction", destination: "/treatments/laser/laser-hair-removal", permanent: true },
      { source: "/services/pico-laser", destination: "/treatments/laser/pico-laser", permanent: true },
      { source: "/services/q-switched-nd-yag-laser", destination: "/treatments/laser/q-switched-nd-yag", permanent: true },
      { source: "/services/dermal-fillers", destination: "/treatments/injectables/dermal-fillers", permanent: true },
      { source: "/services/anti-wrinkle-treatment", destination: "/treatments/injectables/anti-wrinkle", permanent: true },
      { source: "/services/thread-lift", destination: "/treatments/injectables/threads", permanent: true },
      { source: "/services/skin-booster-injections", destination: "/treatments/injectables/skin-boosters", permanent: true },
      { source: "/services/skin-bio-remodelling", destination: "/treatments/injectables/bio-remodelling", permanent: true },
      { source: "/services/lip-beautification", destination: "/treatments/injectables/lip-beautification", permanent: true },
      { source: "/services/face-slimming", destination: "/treatments/injectables/face-slimming", permanent: true },
      { source: "/services/eyebrow-lift", destination: "/treatments/injectables/brow-lift", permanent: true },
      { source: "/services/ear-lobe-repair", destination: "/treatments/injectables/ear-lobe-repair", permanent: true },
      { source: "/services/body-polish", destination: "/treatments/body/body-polish", permanent: true },
      { source: "/services/stretch-marks-treatment", destination: "/treatments/body/stretch-marks", permanent: true },
      { source: "/services/iv-nutrition", destination: "/treatments/body/iv-nutrition", permanent: true },
      { source: "/services/3d-skin-analyzer", destination: "/treatments/3d-skin-analyzer", permanent: true },
      { source: "/services/acne-pimple-conditions", destination: "/conditions/acne", permanent: true },
      { source: "/services/melasma-condition", destination: "/conditions/melasma", permanent: true },
      { source: "/services/hyperpigmentation-condition", destination: "/conditions/hyperpigmentation", permanent: true },
      { source: "/services/hairfall", destination: "/conditions/hairfall", permanent: true },
      { source: "/services/excessive-hair-growth", destination: "/conditions/excessive-hair-growth", permanent: true },
      { source: "/services/wrinkle", destination: "/conditions/wrinkles", permanent: true },
      { source: "/services/aging", destination: "/conditions/ageing", permanent: true }
    ];
  }
};

export default nextConfig;
