USE twachaclinic;

INSERT INTO site_settings (setting_key, setting_value) VALUES
('clinicName', 'Twacha Skin Clinic'),
('phone', '+91-93503-03663'),
('email', 'contact@twachaclinic.com'),
('address', 'Twacha Skin Clinic, A Unit of MaxDermCare Skin and Laser Pvt. Ltd. Sector 12A, Dwarka, New Delhi')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

INSERT INTO doctors (slug, name, title, image, summary, highlights, active) VALUES
('dr-tapesh-sharma', 'Dr. Tapesh Sharma', 'Co-founder and Medical Director', '/assets/img/team/dr-tapesh-1.webp', 'Dermatologist and aesthetic physician with experience in skin, hair and aesthetic treatments.', JSON_ARRAY('MBBS from SNMC, Agra', 'Postgraduate Dermatology specialization from LLRM, Meerut', 'Member of IACD, IADVL, ACSI and CDSI'), 1),
('dr-richa-sharma', 'Dr. Richa Sharma', 'Co-founder and Medical Director', '/assets/img/team/dr-richa-1.webp', 'Dermatologist with MBBS and MD Dermatology from Lady Hardinge Medical College, New Delhi.', JSON_ARRAY('Former lecturer and consultant dermatologist', 'Speaker and author in dermatology forums', 'Focuses on hair disorders and aesthetic dermatology'), 1),
('dr-neha-gupta', 'Dr. Neha Gupta', 'Consultant Dermatologist', '/assets/img/team/dr-neha-1.webp', 'Consultant dermatologist, aesthetic dermatologist and cosmetologist.', JSON_ARRAY('MBBS, MD and DNB Dermatology', 'Skilled in lasers and skin procedures', 'Patient-centred consultation style'), 1),
('dr-prachi-gupta', 'Dr. Prachi Gupta', 'Consultant Dermatologist', '/assets/img/team/Dr-Prachi-Gupta.webp', 'Consultant dermatologist, aesthetic physician and hair transplant surgeon.', JSON_ARRAY('Over 12 years of clinical experience', 'M.B.B.S and D.D.V.L qualified', 'Expertise in skin boosters, lasers and hair restoration'), 1)
ON DUPLICATE KEY UPDATE summary = VALUES(summary);

INSERT INTO services (slug, title, category, image, excerpt, content, benefits, meta_title, meta_description, active) VALUES
('laser-hair-reduction', 'Laser Hair Reduction', 'Laser Dermatology', '/assets/img/service/Laser-Hair-Reduction-treatment-1.webp', 'Dermatologist-guided laser hair reduction.', 'Laser hair reduction is planned after consultation, skin typing and clear aftercare guidance.', JSON_ARRAY('Personalised settings', 'Multiple body areas', 'Clinic-grade technology'), 'Laser Hair Reduction in Dwarka | Twacha Skin Clinic', 'Consult Twacha Skin Clinic in Dwarka for dermatologist-led laser hair reduction.', 1),
('acne-pimple-scars-treatment', 'Acne and Pimple Scar Treatment', 'Acne Care', '/assets/img/service/acne-pimple-scars-treatment/Acne-Pimple-scar-treatment-1.webp', 'Structured acne and scar care.', 'Treatment plans may include prescriptions, peels, lasers, microneedling or radiofrequency depending on diagnosis.', JSON_ARRAY('Targets acne and marks separately', 'Dermatologist-supervised', 'Progress tracking'), 'Acne Scar Treatment in Dwarka | Twacha Skin Clinic', 'Get consultation-led acne and acne scar treatment at Twacha Skin Clinic.', 1),
('chemical-peels', 'Chemical Peels', 'Skin Rejuvenation', '/assets/img/service/chemical-peels/chemical-peels.webp', 'Medical chemical peels for skin tone and texture.', 'Peel type and strength are selected after dermatologist evaluation.', JSON_ARRAY('Improves dullness', 'Options for acne-prone skin', 'Doctor-selected strength'), 'Chemical Peels in Dwarka | Twacha Skin Clinic', 'Explore medical chemical peels at Twacha Skin Clinic, Dwarka.', 1)
ON DUPLICATE KEY UPDATE excerpt = VALUES(excerpt);
