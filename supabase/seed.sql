-- =====================================================================
-- NEX COMMUNITY PLATFORM - SEED DATA
-- Pre-populates taxonomy tables: schools, skills, interests, categories
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. SEED SCHOOLS & UNIVERSITIES
-- ---------------------------------------------------------------------
INSERT INTO public.schools (name, short_name, slug, domain) VALUES
('University of the Philippines Diliman', 'UPD', 'up-diliman', 'upd.edu.ph'),
('De La Salle University', 'DLSU', 'dlsu-manila', 'dlsu.edu.ph'),
('Ateneo de Manila University', 'ADMU', 'ateneo', 'ateneo.edu'),
('University of Santo Tomas', 'UST', 'ust', 'ust.edu.ph'),
('Mapúa University', 'Mapua', 'mapua', 'mapua.edu.ph'),
('Polytechnic University of the Philippines', 'PUP', 'pup', 'pup.edu.ph'),
('Technological University of the Philippines', 'TUP', 'tup', 'tup.edu.ph'),
('Far Eastern University', 'FEU', 'feu', 'feu.edu.ph'),
('Asia Pacific College', 'APC', 'apc', 'apc.edu.ph'),
('Adamson University', 'AdU', 'adamson', 'adamson.edu.ph')
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------
-- 2. SEED SKILLS
-- ---------------------------------------------------------------------
INSERT INTO public.skills (name, slug, category) VALUES
-- Frontend
('React', 'react', 'Frontend'),
('Next.js', 'nextjs', 'Frontend'),
('TypeScript', 'typescript', 'Languages'),
('JavaScript', 'javascript', 'Languages'),
('Tailwind CSS', 'tailwindcss', 'Frontend'),
('Vue.js', 'vuejs', 'Frontend'),
('HTML/CSS', 'html-css', 'Frontend'),
-- Backend & Databases
('Node.js', 'nodejs', 'Backend'),
('Python', 'python', 'Languages'),
('PostgreSQL', 'postgresql', 'Databases'),
('Supabase', 'supabase', 'Cloud & DB'),
('Go', 'go', 'Languages'),
('Java', 'java', 'Languages'),
('C++', 'cpp', 'Languages'),
('Rust', 'rust', 'Languages'),
('MongoDB', 'mongodb', 'Databases'),
('Redis', 'redis', 'Databases'),
-- AI & Data
('PyTorch', 'pytorch', 'AI/ML'),
('TensorFlow', 'tensorflow', 'AI/ML'),
('Scikit-Learn', 'scikit-learn', 'AI/ML'),
('Data Analysis', 'data-analysis', 'Data'),
-- Mobile
('Flutter', 'flutter', 'Mobile'),
('React Native', 'react-native', 'Mobile'),
('Swift', 'swift', 'Mobile'),
('Kotlin', 'kotlin', 'Mobile'),
-- Design & Product
('Figma', 'figma', 'Design'),
('UI/UX Design', 'ui-ux-design', 'Design'),
-- DevOps & Tools
('Docker', 'docker', 'DevOps'),
('Git & GitHub', 'git-github', 'Tools'),
('Linux', 'linux', 'DevOps'),
('AWS', 'aws', 'Cloud')
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------
-- 3. SEED INTERESTS
-- ---------------------------------------------------------------------
INSERT INTO public.interests (name, slug) VALUES
('AI & Machine Learning', 'ai-machine-learning'),
('Web Development', 'web-development'),
('Mobile App Development', 'mobile-app-development'),
('Hackathons & Competitions', 'hackathons-competitions'),
('Open Source Contribution', 'open-source-contribution'),
('UI/UX & Product Design', 'ui-ux-product-design'),
('Cybersecurity', 'cybersecurity'),
('Cloud & DevOps', 'cloud-devops'),
('Blockchain & Web3', 'blockchain-web3'),
('Game Development', 'game-development'),
('IoT & Hardware', 'iot-hardware'),
('Startup & Entrepreneurship', 'startup-entrepreneurship')
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------
-- 4. SEED POST CATEGORIES
-- ---------------------------------------------------------------------
INSERT INTO public.post_categories (name, slug, description, post_type) VALUES
('General Discussions', 'discussions', 'Open-ended student discussions, tech topics, and ideas', 'DISCUSSION'),
('Questions & Help', 'questions', 'Get help with code, debugging, and university coursework', 'QUESTION'),
('Project Showcase', 'project-showcase', 'Show what you built and receive student feedback', 'PROJECT'),
('Teammate Search', 'collaborations', 'Find teammates for hackathons and projects', 'COLLABORATION'),
('Opportunities & Gigs', 'opportunities', 'Share hackathons, internships, scholarships, and jobs', 'OPPORTUNITY'),
('Platform Announcements', 'announcements', 'Official news, updates, and community milestones', 'ANNOUNCEMENT')
ON CONFLICT (slug) DO NOTHING;
