<?php

namespace Database\Seeders;

use App\Models\CompanyProfile;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RecruitmentSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::transaction(function () use ($now): void {
            $seededBulkDataset = DB::table('company_profiles')
                ->where('registration_number', 'ZW-2024-10231')
                ->exists();

            if (! $seededBulkDataset) {
                $companyIds = $this->seedCompanyProfiles($now);
                $candidateIds = $this->seedCandidateProfiles($now);
                $this->seedCandidateEducations($candidateIds, $now);
                $this->seedCandidateExperiences($candidateIds, $now);
                $this->seedCandidateSkills($candidateIds, $now);
                $vacancyIds = $this->seedVacancies($companyIds, $now);
                $this->seedVacancyApplications($vacancyIds, $candidateIds, $now);
                $this->seedPayments($candidateIds, $now);
            }

            $planIds = $this->seedSubscriptionPlans($now);
            $this->seedDemoHubUsers($planIds, $now);
        });

        $this->command?->info('RecruitmentSeeder completed.');
        $this->command?->line('Company Profiles: 8');
        $this->command?->line('Candidate Profiles: 25');
        $this->command?->line('Vacancies: 20');
        $this->command?->line('Vacancy Applications: 40');
        $this->command?->line('Payments: 15');
    }

    // ──────────────────────────────────────────────
    //  Company Profiles
    // ──────────────────────────────────────────────

    private function seedCompanyProfiles(CarbonInterface $now): array
    {
        $companies = $this->companyProfileData();
        $ids = [];

        foreach ($companies as $company) {
            $ids[$company['company_name']] = DB::table('company_profiles')->insertGetId(array_merge($company, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }

        return $ids;
    }

    private function companyProfileData(): array
    {
        return [
            [
                'owner_user_id' => null,
                'organization_id' => null,
                'company_name' => 'TechVentures Zimbabwe',
                'industry' => 'information_technology',
                'registration_number' => 'ZW-2024-10231',
                'email' => 'info@techventures.co.zw',
                'phone' => '+263 242 700100',
                'website' => 'https://www.techventures.co.zw',
                'address' => '14 Samora Machel Avenue, Harare',
                'description' => 'Leading technology company specialising in enterprise software development, cloud solutions and digital transformation for Zimbabwean businesses.',
                'logo_path' => null,
                'status' => 'active',
                'approved_at' => Carbon::parse('2025-06-15 09:00:00'),
                'metadata' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'owner_user_id' => null,
                'organization_id' => null,
                'company_name' => 'Greenfields Agri Holdings',
                'industry' => 'agriculture',
                'registration_number' => 'ZW-2024-10345',
                'email' => 'hr@greenfieldsagri.co.zw',
                'phone' => '+263 242 710200',
                'website' => 'https://www.greenfieldsagri.co.zw',
                'address' => '23 Leopold Takawira Street, Harare',
                'description' => 'Diversified agricultural holding company operating large-scale commercial farms and agro-processing facilities across Zimbabwe.',
                'logo_path' => null,
                'status' => 'active',
                'approved_at' => Carbon::parse('2025-07-01 10:30:00'),
                'metadata' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'owner_user_id' => null,
                'organization_id' => null,
                'company_name' => 'Mashonaland Mining Corp',
                'industry' => 'mining',
                'registration_number' => 'ZW-2024-10478',
                'email' => 'careers@mashmining.co.zw',
                'phone' => '+263 242 720300',
                'website' => 'https://www.mashmining.co.zw',
                'address' => '8 Kwame Nkrumah Avenue, Harare',
                'description' => 'Gold and platinum mining corporation with active operations in Mashonaland provinces, committed to sustainable and responsible mining practices.',
                'logo_path' => null,
                'status' => 'active',
                'approved_at' => Carbon::parse('2025-05-20 08:00:00'),
                'metadata' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'owner_user_id' => null,
                'organization_id' => null,
                'company_name' => 'ZimBuild Construction',
                'industry' => 'construction',
                'registration_number' => 'ZW-2024-10592',
                'email' => 'info@zimbuild.co.zw',
                'phone' => '+263 242 730400',
                'website' => 'https://www.zimbuild.co.zw',
                'address' => '45 Robert Mugabe Road, Harare',
                'description' => 'Full-service construction and civil engineering company delivering residential, commercial and infrastructure projects throughout Zimbabwe.',
                'logo_path' => null,
                'status' => 'active',
                'approved_at' => Carbon::parse('2025-08-10 14:00:00'),
                'metadata' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'owner_user_id' => null,
                'organization_id' => null,
                'company_name' => 'First Capital Bank ZW',
                'industry' => 'banking',
                'registration_number' => 'ZW-2024-10611',
                'email' => 'recruitment@firstcapital.co.zw',
                'phone' => '+263 242 740500',
                'website' => 'https://www.firstcapitalbank.co.zw',
                'address' => '1 Jason Moyo Avenue, Harare',
                'description' => 'Commercial bank providing retail, corporate, and investment banking services with a growing digital banking platform.',
                'logo_path' => null,
                'status' => 'active',
                'approved_at' => Carbon::parse('2025-04-25 11:00:00'),
                'metadata' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'owner_user_id' => null,
                'organization_id' => null,
                'company_name' => 'Innov8 Digital Solutions',
                'industry' => 'information_technology',
                'registration_number' => 'ZW-2024-10729',
                'email' => 'hello@innov8digital.co.zw',
                'phone' => '+263 242 750600',
                'website' => 'https://www.innov8digital.co.zw',
                'address' => '72 Nelson Mandela Avenue, Harare',
                'description' => 'Digital agency focused on mobile application development, fintech solutions and UI/UX design for the African market.',
                'logo_path' => null,
                'status' => 'pending_review',
                'approved_at' => null,
                'metadata' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'owner_user_id' => null,
                'organization_id' => null,
                'company_name' => 'Masvingo Healthcare Group',
                'industry' => 'healthcare',
                'registration_number' => 'ZW-2024-10834',
                'email' => 'admin@masvingohealthcare.co.zw',
                'phone' => '+263 392 263100',
                'website' => 'https://www.masvingohealthcare.co.zw',
                'address' => '15 Hughes Street, Masvingo',
                'description' => 'Private healthcare group operating clinics and a 120-bed hospital in Masvingo province, offering specialist and general medical services.',
                'logo_path' => null,
                'status' => 'draft',
                'approved_at' => null,
                'metadata' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'owner_user_id' => null,
                'organization_id' => null,
                'company_name' => 'Sunshine Retail Group',
                'industry' => 'retail',
                'registration_number' => 'ZW-2024-10948',
                'email' => 'hr@sunshineretail.co.zw',
                'phone' => '+263 242 760700',
                'website' => 'https://www.sunshineretail.co.zw',
                'address' => '33 First Street, Harare',
                'description' => 'Fast-growing retail chain with 25 supermarket outlets across major Zimbabwean cities, specialising in groceries and household goods.',
                'logo_path' => null,
                'status' => 'suspended',
                'approved_at' => Carbon::parse('2025-03-01 09:00:00'),
                'metadata' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
        ];
    }

    // ──────────────────────────────────────────────
    //  Candidate Profiles
    // ──────────────────────────────────────────────

    private function seedCandidateProfiles(CarbonInterface $now): array
    {
        $candidates = $this->candidateProfileData($now);
        $ids = [];

        foreach ($candidates as $candidate) {
            $ids[] = DB::table('candidate_profiles')->insertGetId(array_merge($candidate, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }

        return $ids;
    }

    private function candidateProfileData(CarbonInterface $now): array
    {
        $locations = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo', 'Chinhoyi'];

        $candidates = [
            // 1-15: active (is_public=true, paid)
            ['Tatenda', 'Moyo', 'M', '1990-03-15', 'Harare', 'Senior Software Engineer | 8+ years in fintech', 'Full-stack developer with deep experience building payment platforms and banking APIs for the Zimbabwean and Southern African market.', 3000, 8, 'bachelors', 'active', true],
            ['Chiedza', 'Dube', 'F', '1992-07-22', 'Bulawayo', 'Financial Analyst | CFA Level II Candidate', 'Detail-oriented financial analyst with experience in corporate finance, investment analysis and financial modelling across banking and mining sectors.', 2500, 6, 'masters', 'active', true],
            ['Kudakwashe', 'Ncube', 'M', '1988-11-05', 'Harare', 'Mining Engineer | Gold & Platinum Operations', 'Experienced mining engineer with expertise in open-pit and underground mining operations, mine planning and safety compliance.', 3500, 10, 'bachelors', 'active', true],
            ['Rumbidzai', 'Sibanda', 'F', '1995-01-18', 'Mutare', 'HR Business Partner | Talent Management Specialist', 'Strategic HR professional focused on talent acquisition, employee engagement and organisational development in manufacturing and FMCG.', 2200, 5, 'bachelors', 'active', true],
            ['Tendai', 'Ndlovu', 'M', '1991-06-30', 'Harare', 'Data Scientist | Machine Learning & Analytics', 'Data scientist applying machine learning and statistical analysis to solve business problems in telecommunications and financial services.', 2800, 7, 'masters', 'active', true],
            ['Farai', 'Chirwa', 'M', '1993-09-12', 'Gweru', 'Civil Engineer | Infrastructure Projects', 'Civil engineer with a track record of delivering road, bridge and building projects on time and within budget across Zimbabwe.', 2600, 6, 'bachelors', 'active', true],
            ['Nyasha', 'Mutasa', 'F', '1994-04-25', 'Harare', 'Digital Marketing Manager | SEO & Social Media', 'Creative marketing professional driving brand growth through digital channels, content strategy and performance marketing campaigns.', 2000, 5, 'bachelors', 'active', true],
            ['Tamuka', 'Chigumba', 'M', '1987-12-08', 'Bulawayo', 'Chartered Accountant | Audit & Compliance', 'Qualified CA(Z) with extensive experience in external audit, internal controls and financial reporting for listed companies.', 3200, 12, 'professional', 'active', true],
            ['Rutendo', 'Zvobgo', 'F', '1996-02-14', 'Harare', 'UI/UX Designer | Mobile-First Products', 'User experience designer creating intuitive mobile and web interfaces with a focus on accessibility and African user contexts.', 1800, 4, 'bachelors', 'active', true],
            ['Ruvimbo', 'Makoni', 'F', '1993-08-03', 'Masvingo', 'Project Manager | PMP Certified', 'Certified project manager with experience leading cross-functional teams on IT implementation and construction projects.', 2700, 7, 'masters', 'active', true],
            ['Takudzwa', 'Charamba', 'M', '1990-05-19', 'Harare', 'DevOps Engineer | AWS & Azure Cloud', 'DevOps specialist building CI/CD pipelines and managing cloud infrastructure for high-availability enterprise applications.', 3000, 8, 'bachelors', 'active', true],
            ['Tsitsi', 'Hwende', 'F', '1991-10-27', 'Chinhoyi', 'Agricultural Economist | Value Chain Analysis', 'Agricultural economist advising on crop economics, market analysis and agribusiness strategy for commercial farming operations.', 2400, 7, 'masters', 'active', true],
            ['Munyaradzi', 'Mupfumira', 'M', '1989-03-11', 'Harare', 'Sales Director | FMCG & Retail', 'Results-driven sales leader with proven experience growing revenue and market share for consumer goods brands in Southern Africa.', 3500, 11, 'bachelors', 'active', true],
            ['Blessing', 'Mashingaidze', 'F', '1997-06-05', 'Harare', 'Junior Developer | Laravel & React', 'Enthusiastic junior developer with hands-on experience in PHP/Laravel and React, eager to contribute to innovative technology projects.', 1200, 2, 'bachelors', 'active', true],
            ['Tapiwa', 'Nyoni', 'M', '1992-01-20', 'Bulawayo', 'Electrical Engineer | Power Systems', 'Electrical engineer specialising in power distribution, renewable energy systems and electrical installations for industrial facilities.', 2800, 7, 'bachelors', 'active', true],

            // 16-20: pending_payment
            ['Simbarashe', 'Gumbo', 'M', '1994-11-14', 'Harare', 'IT Support Specialist | Network Administration', 'IT support professional experienced in network administration, helpdesk management and server maintenance for corporate environments.', 1500, 4, 'diploma', 'pending_payment', false],
            ['Anesu', 'Chipunza', 'F', '1996-08-09', 'Mutare', 'Accountant | Tax & Payroll', 'Qualified accountant with expertise in tax compliance, payroll processing and management accounting for SMEs.', 1800, 3, 'bachelors', 'pending_payment', false],
            ['Yeukai', 'Marufu', 'F', '1993-04-17', 'Gweru', 'Nurse Practitioner | Primary Healthcare', 'Registered nurse with clinical experience in primary healthcare, maternal health and community health programmes.', 1600, 6, 'diploma', 'pending_payment', false],
            ['Kudzai', 'Zvinavashe', 'M', '1995-07-28', 'Harare', 'Graphic Designer | Brand Identity', 'Creative graphic designer with a portfolio spanning brand identity, packaging design and digital media for Zimbabwean businesses.', 1400, 3, 'diploma', 'pending_payment', false],
            ['Tafadzwa', 'Chinembiri', 'M', '1991-12-03', 'Harare', 'Logistics Manager | Supply Chain', 'Logistics manager with experience optimising supply chain operations, fleet management and warehouse processes.', 2200, 8, 'bachelors', 'pending_payment', false],

            // 21-23: draft
            ['Tinashe', 'Mushonga', 'M', '1998-02-25', 'Harare', 'Graduate Trainee | Computer Science', 'Recent computer science graduate seeking an entry-level position in software development or IT support.', 800, 0, 'bachelors', 'draft', false],
            ['Nobuhle', 'Chadya', 'F', '1997-09-16', 'Bulawayo', 'Intern | Marketing Communications', 'Marketing communications intern with coursework in digital marketing, public relations and consumer behaviour.', 600, 0, 'bachelors', 'draft', false],
            ['Sipho', 'Chikwava', 'M', '1999-05-10', 'Mutare', 'Graduate | Mechanical Engineering', 'Mechanical engineering graduate with practical workshop experience and CAD design skills seeking an engineering traineeship.', 900, 0, 'bachelors', 'draft', false],

            // 24-25: expired
            ['Zanele', 'Mapfumo', 'F', '1986-08-22', 'Harare', 'Senior Accountant | 15 Years Experience', 'Highly experienced accountant with a long career in financial management, budgeting and reporting for large corporations.', 3000, 15, 'professional', 'expired', false],
            ['Mthulisi', 'Nkomo', 'M', '1985-04-07', 'Bulawayo', 'Operations Manager | Manufacturing', 'Operations manager with extensive experience in manufacturing process optimisation, quality management and lean manufacturing.', 3200, 16, 'masters', 'expired', false],
        ];

        $result = [];
        $phoneIndex = 0;
        $phones = [
            '+263 771 234 567', '+263 772 345 678', '+263 773 456 789', '+263 774 567 890',
            '+263 775 678 901', '+263 776 789 012', '+263 777 890 123', '+263 778 901 234',
            '+263 712 123 456', '+263 713 234 567', '+263 714 345 678', '+263 715 456 789',
            '+263 716 567 890', '+263 717 678 901', '+263 718 789 012', '+263 719 890 123',
            '+263 733 123 456', '+263 734 234 567', '+263 735 345 678', '+263 736 456 789',
            '+263 737 567 890', '+263 738 678 901', '+263 739 789 012', '+263 771 890 234',
            '+263 772 901 345',
        ];

        $nationalIdBase = 63;

        foreach ($candidates as $i => $c) {
            [$first, $surname, $gender, $dob, $location, $headline, $summary, $salary, $years, $education, $visibility, $isPublic] = $c;

            $email = strtolower($first) . '.' . strtolower($surname) . '@email.co.zw';
            $nationalId = ($nationalIdBase + $i) . '-' . (2000000 + $i * 1111) . 'A' . ($nationalIdBase + $i);

            $listingActivatedAt = null;
            $listingExpiresAt = null;
            $listingFeeAmount = 1.00;
            $listingFeeCurrency = 'USD';

            if ($visibility === 'active') {
                $listingFeeAmount = 1.00;
                $listingFeeCurrency = 'USD';
                $listingActivatedAt = Carbon::parse('2026-01-15')->addDays($i);
                $listingExpiresAt = $listingActivatedAt->copy()->addDays(90);
            } elseif ($visibility === 'expired') {
                $listingFeeAmount = 1.00;
                $listingFeeCurrency = 'USD';
                $listingActivatedAt = Carbon::parse('2025-06-01')->addDays($i);
                $listingExpiresAt = $listingActivatedAt->copy()->addDays(90);
            }

            $result[] = [
                'user_id' => null,
                'organization_id' => null,
                'requisition_code' => null,
                'full_name' => $first . ' ' . $surname,
                'email' => $email,
                'phone' => $phones[$phoneIndex],
                'alt_phone' => null,
                'national_id' => $nationalId,
                'gender' => $gender,
                'date_of_birth' => $dob,
                'location' => $location,
                'headline' => $headline,
                'professional_summary' => $summary,
                'expected_salary' => $salary,
                'salary_currency' => 'USD',
                'years_experience' => $years,
                'highest_education' => $education,
                'profile_visibility_status' => $visibility,
                'is_public' => $isPublic ? 1 : 0,
                'is_verified' => $isPublic ? 1 : 0,
                'listing_fee_amount' => $listingFeeAmount,
                'listing_fee_currency' => $listingFeeCurrency,
                'listing_activated_at' => $listingActivatedAt,
                'listing_expires_at' => $listingExpiresAt,
                'stage' => $visibility === 'active' ? 'HIRED' : ($visibility === 'draft' ? 'APPLIED' : 'SCREENING'),
                'status' => 'active',
                'notes' => null,
                'metadata' => null,
            ];

            $phoneIndex++;
        }

        return $result;
    }

    // ──────────────────────────────────────────────
    //  Candidate Educations
    // ──────────────────────────────────────────────

    private function seedCandidateEducations(array $candidateIds, CarbonInterface $now): void
    {
        $records = [];

        $educationData = [
            // Candidate 1: Tatenda Moyo
            [0, 'University of Zimbabwe', 'BSc', 'Computer Science', '2008-02-01', '2012-11-30', '2.1'],
            [0, 'Harare Polytechnic', 'Diploma', 'Information Technology', '2006-01-15', '2007-12-15', 'Credit'],
            // Candidate 2: Chiedza Dube
            [1, 'National University of Science and Technology', 'BCom', 'Finance', '2010-02-01', '2014-11-30', '2.1'],
            [1, 'University of Zimbabwe', 'MSc', 'Finance', '2015-02-01', '2017-06-30', 'Distinction'],
            // Candidate 3: Kudakwashe Ncube
            [2, 'University of Zimbabwe', 'BEng', 'Mining Engineering', '2006-02-01', '2010-11-30', '2.1'],
            [2, 'Speciss College', 'Higher National Diploma', 'Engineering Studies', '2004-01-15', '2005-12-15', 'Merit'],
            // Candidate 4: Rumbidzai Sibanda
            [3, 'Midlands State University', 'BSc', 'Human Resource Management', '2013-02-01', '2017-06-30', '2.1'],
            [3, 'Midlands State University', 'Diploma', 'Personnel Management', '2011-01-15', '2012-12-15', 'Credit'],
            // Candidate 5: Tendai Ndlovu
            [4, 'National University of Science and Technology', 'BSc', 'Applied Mathematics', '2009-02-01', '2013-11-30', '1st'],
            [4, 'University of Zimbabwe', 'MSc', 'Data Science', '2014-02-01', '2016-06-30', 'Distinction'],
            // Candidate 6: Farai Chirwa
            [5, 'University of Zimbabwe', 'BEng', 'Civil Engineering', '2011-02-01', '2015-11-30', '2.1'],
            [5, 'Chinhoyi University of Technology', 'Diploma', 'Construction Management', '2009-01-15', '2010-12-15', 'Merit'],
            // Candidate 7: Nyasha Mutasa
            [6, 'Midlands State University', 'BCom', 'Marketing', '2012-02-01', '2016-06-30', '2.1'],
            [6, 'NIIT Zimbabwe', 'Diploma', 'Digital Marketing', '2016-08-01', '2017-02-28', 'Distinction'],
            // Candidate 8: Tamuka Chigumba
            [7, 'University of Zimbabwe', 'BCom', 'Accounting', '2005-02-01', '2009-11-30', '2.1'],
            [7, 'ICAZ', 'Professional', 'Chartered Accountant CA(Z)', '2010-01-01', '2013-06-30', 'Pass'],
            [7, 'Speciss College', 'Higher National Diploma', 'Accounting', '2003-01-15', '2004-12-15', 'Distinction'],
            // Candidate 9: Rutendo Zvobgo
            [8, 'Chinhoyi University of Technology', 'BSc', 'Information Systems', '2014-02-01', '2018-06-30', '2.1'],
            [8, 'NIIT Zimbabwe', 'Diploma', 'Web Design', '2018-08-01', '2019-02-28', 'Credit'],
            // Candidate 10: Ruvimbo Makoni
            [9, 'Africa University', 'BSc', 'Project Management', '2011-02-01', '2015-06-30', '2.1'],
            [9, 'University of Zimbabwe', 'MBA', 'Business Administration', '2016-02-01', '2018-06-30', 'Merit'],
            // Candidate 11: Takudzwa Charamba
            [10, 'National University of Science and Technology', 'BSc', 'Computer Science', '2008-02-01', '2012-11-30', '2.1'],
            [10, 'Harare Polytechnic', 'Diploma', 'Networking', '2006-01-15', '2007-12-15', 'Merit'],
            // Candidate 12: Tsitsi Hwende
            [11, 'University of Zimbabwe', 'BSc', 'Agricultural Economics', '2009-02-01', '2013-11-30', '2.1'],
            [11, 'University of Zimbabwe', 'MSc', 'Agricultural Economics', '2014-02-01', '2016-06-30', 'Distinction'],
            // Candidate 13: Munyaradzi Mupfumira
            [12, 'Midlands State University', 'BCom', 'Marketing', '2007-02-01', '2011-06-30', '2.2'],
            [12, 'Bindura University', 'Diploma', 'Sales Management', '2005-01-15', '2006-12-15', 'Credit'],
            // Candidate 14: Blessing Mashingaidze
            [13, 'Chinhoyi University of Technology', 'BSc', 'Computer Science', '2019-02-01', '2023-06-30', '2.1'],
            [13, 'Harare Polytechnic', 'Diploma', 'Software Engineering', '2017-01-15', '2018-12-15', 'Credit'],
            // Candidate 15: Tapiwa Nyoni
            [14, 'National University of Science and Technology', 'BEng', 'Electrical Engineering', '2010-02-01', '2014-11-30', '2.1'],
            [14, 'Speciss College', 'Higher National Diploma', 'Electrical Installation', '2008-01-15', '2009-12-15', 'Merit'],
            // Candidate 16: Simbarashe Gumbo
            [15, 'Harare Polytechnic', 'Diploma', 'Information Technology', '2014-01-15', '2016-12-15', 'Credit'],
            [15, 'NIIT Zimbabwe', 'Diploma', 'Network Administration', '2017-02-01', '2017-08-31', 'Merit'],
            // Candidate 17: Anesu Chipunza
            [16, 'Midlands State University', 'BCom', 'Accounting', '2015-02-01', '2019-06-30', '2.1'],
            [16, 'Speciss College', 'Diploma', 'Bookkeeping', '2013-01-15', '2014-12-15', 'Credit'],
            // Candidate 18: Yeukai Marufu
            [17, 'University of Zimbabwe', 'Diploma', 'General Nursing', '2012-02-01', '2015-12-15', 'Credit'],
            [17, 'Harare Polytechnic', 'Diploma', 'Primary Healthcare', '2016-02-01', '2017-06-30', 'Merit'],
            // Candidate 19: Kudzai Zvinavashe
            [18, 'Harare Polytechnic', 'Diploma', 'Graphic Design', '2015-01-15', '2017-12-15', 'Credit'],
            [18, 'NIIT Zimbabwe', 'Diploma', 'Multimedia Design', '2018-02-01', '2018-08-31', 'Merit'],
            // Candidate 20: Tafadzwa Chinembiri
            [19, 'Bindura University', 'BSc', 'Supply Chain Management', '2008-02-01', '2012-06-30', '2.2'],
            [19, 'Chinhoyi University of Technology', 'Diploma', 'Transport & Logistics', '2006-01-15', '2007-12-15', 'Credit'],
            // Candidate 21: Tinashe Mushonga
            [20, 'University of Zimbabwe', 'BSc', 'Computer Science', '2020-02-01', '2024-06-30', '2.1'],
            // Candidate 22: Nobuhle Chadya
            [21, 'National University of Science and Technology', 'BCom', 'Marketing', '2019-02-01', '2023-06-30', '2.1'],
            // Candidate 23: Sipho Chikwava
            [22, 'University of Zimbabwe', 'BEng', 'Mechanical Engineering', '2019-02-01', '2024-06-30', '2.2'],
            // Candidate 24: Zanele Mapfumo
            [23, 'University of Zimbabwe', 'BCom', 'Accounting', '2002-02-01', '2006-11-30', '2.1'],
            [23, 'ICAZ', 'Professional', 'Chartered Accountant CA(Z)', '2007-01-01', '2010-06-30', 'Pass'],
            [23, 'Africa University', 'MBA', 'Business Administration', '2012-02-01', '2014-06-30', 'Merit'],
            // Candidate 25: Mthulisi Nkomo
            [24, 'National University of Science and Technology', 'BEng', 'Industrial Engineering', '2003-02-01', '2007-11-30', '2.1'],
            [24, 'University of Zimbabwe', 'MSc', 'Manufacturing Systems', '2010-02-01', '2012-06-30', 'Distinction'],
        ];

        foreach ($educationData as $ed) {
            $records[] = [
                'candidate_profile_id' => $candidateIds[$ed[0]],
                'institution' => $ed[1],
                'qualification' => $ed[2],
                'field_of_study' => $ed[3],
                'start_date' => $ed[4],
                'end_date' => $ed[5],
                'grade' => $ed[6],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('candidate_educations')->insert($records);
    }

    // ──────────────────────────────────────────────
    //  Candidate Experiences
    // ──────────────────────────────────────────────

    private function seedCandidateExperiences(array $candidateIds, CarbonInterface $now): void
    {
        $records = [];

        $experienceData = [
            // Candidate 1: Tatenda Moyo
            [0, 'Econet Wireless', 'Software Developer', '2013-01-10', '2016-06-30', false, 'Developed mobile money APIs and payment gateway integrations for the EcoCash platform.'],
            [0, 'CBZ Holdings', 'Senior Software Engineer', '2016-07-15', '2022-12-31', false, 'Led development of the internet banking platform and core banking system integrations.'],
            [0, 'Freelance', 'Technical Consultant', '2023-01-15', null, true, 'Providing software architecture consulting and development services to fintech startups.'],
            // Candidate 2: Chiedza Dube
            [1, 'Old Mutual Zimbabwe', 'Graduate Trainee', '2015-01-05', '2016-12-31', false, 'Rotational programme covering investment analysis, risk management and actuarial functions.'],
            [1, 'NMB Bank', 'Financial Analyst', '2017-02-01', null, true, 'Performing financial modelling, credit analysis and investment appraisal for corporate banking clients.'],
            // Candidate 3: Kudakwashe Ncube
            [2, 'Zimplats', 'Junior Mining Engineer', '2011-02-01', '2015-03-31', false, 'Underground mining operations planning and drill-and-blast design for platinum extraction.'],
            [2, 'Metallon Gold', 'Mine Planning Engineer', '2015-05-01', '2020-08-31', false, 'Mine design optimisation, resource estimation and production scheduling for multiple gold mines.'],
            [2, 'Freelance', 'Mining Consultant', '2020-10-01', null, true, 'Independent consulting on mine feasibility studies and environmental impact assessments.'],
            // Candidate 4: Rumbidzai Sibanda
            [3, 'Delta Corporation', 'HR Officer', '2017-08-01', '2020-06-30', false, 'Managed recruitment, onboarding and employee relations for the beverages division.'],
            [3, 'Innscor Africa', 'HR Business Partner', '2020-07-15', null, true, 'Strategic HR support for operations spanning quick-service restaurants and milling divisions.'],
            // Candidate 5: Tendai Ndlovu
            [4, 'TelOne', 'Data Analyst', '2014-01-10', '2017-03-31', false, 'Built dashboards and reporting tools for network performance monitoring and customer analytics.'],
            [4, 'Econet Wireless', 'Data Scientist', '2017-05-01', null, true, 'Developing predictive models for customer churn, fraud detection and network capacity planning.'],
            // Candidate 6: Farai Chirwa
            [5, 'PPC Zimbabwe', 'Site Engineer', '2016-01-10', '2019-06-30', false, 'Supervised construction of commercial buildings and industrial facilities in Gweru and Kwekwe.'],
            [5, 'Lafarge Zimbabwe', 'Civil Engineer', '2019-08-01', null, true, 'Managing infrastructure projects including road rehabilitation and bridge construction.'],
            // Candidate 7: Nyasha Mutasa
            [6, 'OK Zimbabwe', 'Marketing Officer', '2016-08-01', '2019-12-31', false, 'Planned and executed promotional campaigns, managed social media channels and coordinated events.'],
            [6, 'Nyaradzo', 'Digital Marketing Manager', '2020-02-01', null, true, 'Leading digital transformation of marketing operations including SEO, paid media and content strategy.'],
            // Candidate 8: Tamuka Chigumba
            [7, 'Deloitte Zimbabwe', 'Audit Associate', '2010-01-10', '2013-06-30', false, 'Performed statutory audits for listed companies in banking, mining and manufacturing sectors.'],
            [7, 'ZB Bank', 'Internal Auditor', '2013-08-01', '2018-03-31', false, 'Evaluated internal controls, conducted risk assessments and reported to the audit committee.'],
            [7, 'Schweppes', 'Finance Manager', '2018-05-01', null, true, 'Overseeing financial reporting, budgeting and compliance for the beverages manufacturing group.'],
            // Candidate 9: Rutendo Zvobgo
            [8, 'Innov8 Digital', 'Junior Designer', '2019-03-01', '2021-06-30', false, 'Created wireframes, prototypes and UI designs for mobile banking and e-commerce applications.'],
            [8, 'Freelance', 'UI/UX Designer', '2021-07-15', null, true, 'Freelance design work for fintech and healthtech startups across Southern Africa.'],
            // Candidate 10: Ruvimbo Makoni
            [9, 'Zimpost', 'Project Coordinator', '2015-08-01', '2018-12-31', false, 'Coordinated logistics and infrastructure upgrade projects across regional post offices.'],
            [9, 'NetOne', 'Project Manager', '2019-02-01', null, true, 'Managing network expansion and digital services rollout projects nationwide.'],
            // Candidate 11: Takudzwa Charamba
            [10, 'TelOne', 'Systems Administrator', '2013-01-10', '2016-06-30', false, 'Managed Linux servers, network infrastructure and virtualisation platforms.'],
            [10, 'Econet Wireless', 'DevOps Engineer', '2016-08-01', null, true, 'Building and maintaining CI/CD pipelines, container orchestration and cloud infrastructure on AWS.'],
            // Candidate 12: Tsitsi Hwende
            [11, 'Cottco Holdings', 'Research Assistant', '2014-01-10', '2016-03-31', false, 'Conducted crop economics research and farmer survey data analysis for cotton value chains.'],
            [11, 'Greenfields Agri', 'Agricultural Economist', '2016-05-01', null, true, 'Advising on crop diversification strategy, market analysis and agricultural investment planning.'],
            // Candidate 13: Munyaradzi Mupfumira
            [12, 'Delta Corporation', 'Sales Representative', '2012-01-10', '2015-06-30', false, 'Managed key accounts and grew sales volumes across Harare metropolitan territory.'],
            [12, 'OK Zimbabwe', 'Regional Sales Manager', '2015-08-01', '2020-03-31', false, 'Led a team of 15 sales executives covering Mashonaland East and Central provinces.'],
            [12, 'Innscor Africa', 'Sales Director', '2020-05-01', null, true, 'Directing national sales strategy for the quick-service restaurant and retail food divisions.'],
            // Candidate 14: Blessing Mashingaidze
            [13, 'Innov8 Digital', 'Intern Developer', '2023-08-01', '2024-01-31', false, 'Built frontend components in React and backend APIs in Laravel for client projects.'],
            [13, 'Freelance', 'Web Developer', '2024-03-01', null, true, 'Developing websites and web applications for small businesses using Laravel and React.'],
            // Candidate 15: Tapiwa Nyoni
            [14, 'ZESA Holdings', 'Electrical Engineer', '2015-01-10', '2019-06-30', false, 'Power distribution network maintenance, transformer installations and fault analysis.'],
            [14, 'Econet Wireless', 'Senior Electrical Engineer', '2019-08-01', null, true, 'Managing power systems and backup infrastructure for telecommunications base stations.'],
            // Candidate 16: Simbarashe Gumbo
            [15, 'Zimpost', 'IT Technician', '2017-03-01', '2020-06-30', false, 'Provided desktop support, managed network equipment and maintained office IT infrastructure.'],
            [15, 'NetOne', 'IT Support Specialist', '2020-08-01', null, true, 'Managing helpdesk operations, Active Directory administration and network troubleshooting.'],
            // Candidate 17: Anesu Chipunza
            [16, 'Small Business', 'Bookkeeper', '2019-08-01', '2021-12-31', false, 'Maintained books of accounts, processed payroll and prepared monthly financial statements.'],
            [16, 'CBZ Holdings', 'Accountant', '2022-02-01', null, true, 'Handling tax returns, financial reporting and payroll processing for the group.'],
            // Candidate 18: Yeukai Marufu
            [17, 'Parirenyatwa Hospital', 'Staff Nurse', '2016-01-10', '2019-12-31', false, 'Provided patient care in the general medical ward including medication administration and vital signs monitoring.'],
            [17, 'Masvingo Provincial Hospital', 'Nurse Practitioner', '2020-02-01', null, true, 'Primary healthcare consultations, immunisation programmes and community health outreach.'],
            // Candidate 19: Kudzai Zvinavashe
            [18, 'Freelance', 'Graphic Designer', '2018-03-01', null, true, 'Brand identity design, social media graphics and print materials for Zimbabwean businesses.'],
            // Candidate 20: Tafadzwa Chinembiri
            [19, 'OK Zimbabwe', 'Warehouse Supervisor', '2013-01-10', '2017-06-30', false, 'Supervised warehouse operations, stock control and dispatch for a high-volume distribution centre.'],
            [19, 'Delta Corporation', 'Logistics Manager', '2017-08-01', null, true, 'Managing fleet operations, route optimisation and supply chain coordination for beverage distribution.'],
            // Candidates 21-23: fresh graduates with no experience
            // Candidate 24: Zanele Mapfumo
            [23, 'Deloitte Zimbabwe', 'Audit Senior', '2007-01-10', '2012-06-30', false, 'Managed audit engagements for listed companies in financial services and manufacturing.'],
            [23, 'Old Mutual Zimbabwe', 'Finance Manager', '2012-08-01', '2019-12-31', false, 'Financial reporting, budgeting and management accounting for insurance operations.'],
            [23, 'CBZ Holdings', 'Senior Accountant', '2020-02-01', null, true, 'Group financial consolidation, regulatory reporting and IFRS compliance.'],
            // Candidate 25: Mthulisi Nkomo
            [24, 'Schweppes', 'Production Supervisor', '2008-01-10', '2012-06-30', false, 'Supervised bottling line operations, managed shift teams and maintained quality standards.'],
            [24, 'Delta Corporation', 'Plant Manager', '2012-08-01', '2019-03-31', false, 'Managed full plant operations including production planning, maintenance and safety compliance.'],
            [24, 'Innscor Africa', 'Operations Manager', '2019-05-01', null, true, 'Overseeing manufacturing operations across multiple food processing plants in Zimbabwe.'],
        ];

        foreach ($experienceData as $exp) {
            $records[] = [
                'candidate_profile_id' => $candidateIds[$exp[0]],
                'employer_name' => $exp[1],
                'job_title' => $exp[2],
                'start_date' => $exp[3],
                'end_date' => $exp[4],
                'currently_working' => $exp[5] ? 1 : 0,
                'description' => $exp[6],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('candidate_experiences')->insert($records);
    }

    // ──────────────────────────────────────────────
    //  Candidate Skills
    // ──────────────────────────────────────────────

    private function seedCandidateSkills(array $candidateIds, CarbonInterface $now): void
    {
        $records = [];

        $skillsData = [
            // Candidate 1: Tatenda Moyo
            [0, 'PHP', 'expert', 8],
            [0, 'Laravel', 'expert', 7],
            [0, 'JavaScript', 'advanced', 6],
            [0, 'React', 'advanced', 4],
            [0, 'SQL', 'expert', 8],
            // Candidate 2: Chiedza Dube
            [1, 'Financial Modelling', 'advanced', 5],
            [1, 'Data Analysis', 'advanced', 6],
            [1, 'SAP', 'intermediate', 3],
            [1, 'Communication', 'advanced', 6],
            // Candidate 3: Kudakwashe Ncube
            [2, 'Project Management', 'expert', 10],
            [2, 'Leadership', 'advanced', 8],
            [2, 'Data Analysis', 'intermediate', 4],
            // Candidate 4: Rumbidzai Sibanda
            [3, 'Communication', 'expert', 5],
            [3, 'Leadership', 'advanced', 4],
            [3, 'SAP', 'intermediate', 3],
            [3, 'Project Management', 'intermediate', 3],
            // Candidate 5: Tendai Ndlovu
            [4, 'Python', 'expert', 7],
            [4, 'SQL', 'expert', 7],
            [4, 'Data Analysis', 'expert', 7],
            [4, 'Cloud Computing', 'advanced', 4],
            [4, 'JavaScript', 'intermediate', 3],
            // Candidate 6: Farai Chirwa
            [5, 'Project Management', 'advanced', 6],
            [5, 'Leadership', 'intermediate', 4],
            [5, 'Communication', 'advanced', 6],
            // Candidate 7: Nyasha Mutasa
            [6, 'Digital Marketing', 'expert', 5],
            [6, 'Communication', 'expert', 5],
            [6, 'Data Analysis', 'intermediate', 3],
            [6, 'UI/UX Design', 'intermediate', 2],
            // Candidate 8: Tamuka Chigumba
            [7, 'Accounting', 'expert', 12],
            [7, 'Financial Modelling', 'expert', 10],
            [7, 'SAP', 'advanced', 8],
            [7, 'Leadership', 'advanced', 6],
            [7, 'Communication', 'advanced', 10],
            // Candidate 9: Rutendo Zvobgo
            [8, 'UI/UX Design', 'advanced', 4],
            [8, 'JavaScript', 'intermediate', 3],
            [8, 'React', 'intermediate', 2],
            [8, 'Communication', 'advanced', 4],
            // Candidate 10: Ruvimbo Makoni
            [9, 'Project Management', 'expert', 7],
            [9, 'Agile', 'advanced', 5],
            [9, 'Leadership', 'advanced', 6],
            [9, 'Communication', 'expert', 7],
            // Candidate 11: Takudzwa Charamba
            [10, 'DevOps', 'expert', 7],
            [10, 'Cloud Computing', 'expert', 6],
            [10, 'PHP', 'advanced', 5],
            [10, 'Python', 'intermediate', 3],
            [10, 'SQL', 'advanced', 7],
            // Candidate 12: Tsitsi Hwende
            [11, 'Data Analysis', 'expert', 7],
            [11, 'Financial Modelling', 'advanced', 5],
            [11, 'Communication', 'advanced', 7],
            // Candidate 13: Munyaradzi Mupfumira
            [12, 'Leadership', 'expert', 10],
            [12, 'Communication', 'expert', 11],
            [12, 'Project Management', 'advanced', 6],
            [12, 'Digital Marketing', 'intermediate', 3],
            // Candidate 14: Blessing Mashingaidze
            [13, 'PHP', 'intermediate', 2],
            [13, 'Laravel', 'intermediate', 2],
            [13, 'JavaScript', 'intermediate', 2],
            [13, 'React', 'beginner', 1],
            [13, 'SQL', 'intermediate', 2],
            // Candidate 15: Tapiwa Nyoni
            [14, 'Project Management', 'advanced', 6],
            [14, 'Leadership', 'advanced', 5],
            // Candidate 16: Simbarashe Gumbo
            [15, 'Cloud Computing', 'intermediate', 2],
            [15, 'SQL', 'intermediate', 3],
            [15, 'Communication', 'intermediate', 4],
            // Candidate 17: Anesu Chipunza
            [16, 'Accounting', 'advanced', 3],
            [16, 'SAP', 'intermediate', 2],
            // Candidate 18: Yeukai Marufu
            [17, 'Communication', 'advanced', 6],
            [17, 'Leadership', 'intermediate', 3],
            // Candidate 19: Kudzai Zvinavashe
            [18, 'UI/UX Design', 'advanced', 3],
            [18, 'Digital Marketing', 'intermediate', 2],
            [18, 'Communication', 'intermediate', 3],
            // Candidate 20: Tafadzwa Chinembiri
            [19, 'Project Management', 'advanced', 7],
            [19, 'Leadership', 'advanced', 6],
            [19, 'SAP', 'intermediate', 4],
            // Candidate 21: Tinashe Mushonga
            [20, 'PHP', 'beginner', 0],
            [20, 'JavaScript', 'beginner', 0],
            [20, 'SQL', 'beginner', 0],
            // Candidate 22: Nobuhle Chadya
            [21, 'Digital Marketing', 'beginner', 0],
            [21, 'Communication', 'intermediate', 1],
            // Candidate 23: Sipho Chikwava
            [22, 'Project Management', 'beginner', 0],
            [22, 'Communication', 'intermediate', 1],
            // Candidate 24: Zanele Mapfumo
            [23, 'Accounting', 'expert', 15],
            [23, 'Financial Modelling', 'expert', 12],
            [23, 'SAP', 'expert', 10],
            [23, 'Leadership', 'expert', 10],
            // Candidate 25: Mthulisi Nkomo
            [24, 'Leadership', 'expert', 14],
            [24, 'Project Management', 'expert', 12],
            [24, 'Agile', 'advanced', 6],
            [24, 'Communication', 'expert', 16],
        ];

        foreach ($skillsData as $skill) {
            $records[] = [
                'candidate_profile_id' => $candidateIds[$skill[0]],
                'name' => $skill[1],
                'level' => $skill[2],
                'years_experience' => $skill[3],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('candidate_skills')->insert($records);
    }

    // ──────────────────────────────────────────────
    //  Vacancies
    // ──────────────────────────────────────────────

    private function seedVacancies(array $companyIds, CarbonInterface $now): array
    {
        $vacancies = $this->vacancyData($companyIds);
        $ids = [];

        foreach ($vacancies as $vacancy) {
            $ids[] = DB::table('vacancies')->insertGetId(array_merge($vacancy, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }

        return $ids;
    }

    private function vacancyData(array $companyIds): array
    {
        $techVentures = $companyIds['TechVentures Zimbabwe'];
        $greenfields = $companyIds['Greenfields Agri Holdings'];
        $mashonaland = $companyIds['Mashonaland Mining Corp'];
        $zimBuild = $companyIds['ZimBuild Construction'];
        $firstCapital = $companyIds['First Capital Bank ZW'];
        $innov8 = $companyIds['Innov8 Digital Solutions'];

        return [
            // TechVentures Zimbabwe (4 vacancies)
            [
                'company_profile_id' => $techVentures,
                'title' => 'Senior PHP Developer',
                'department' => 'Engineering',
                'category' => 'information_technology',
                'employment_type' => 'full_time',
                'work_mode' => 'hybrid',
                'location' => 'Harare',
                'description' => 'We are looking for an experienced PHP developer to join our engineering team and lead development of enterprise applications.',
                'requirements' => "5+ years PHP/Laravel experience. Strong understanding of RESTful APIs and microservices architecture. Experience with MySQL and Redis.",
                'responsibilities' => "Lead backend development for client projects. Mentor junior developers. Participate in code reviews and architectural decisions.",
                'salary_min' => 2500,
                'salary_max' => 3500,
                'currency' => 'USD',
                'application_deadline' => '2026-04-30',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-02-15'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $techVentures,
                'title' => 'Junior Frontend Developer',
                'department' => 'Engineering',
                'category' => 'information_technology',
                'employment_type' => 'full_time',
                'work_mode' => 'onsite',
                'location' => 'Harare',
                'description' => 'Entry-level position for a frontend developer to build responsive user interfaces using React and TypeScript.',
                'requirements' => "1+ year experience with React or Vue.js. Basic understanding of TypeScript. Familiarity with Git version control.",
                'responsibilities' => "Build frontend components for web applications. Write unit tests. Collaborate with designers on UI implementation.",
                'salary_min' => 800,
                'salary_max' => 1400,
                'currency' => 'USD',
                'application_deadline' => '2026-05-15',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-03-01'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $techVentures,
                'title' => 'DevOps Engineer',
                'department' => 'Infrastructure',
                'category' => 'information_technology',
                'employment_type' => 'full_time',
                'work_mode' => 'remote',
                'location' => 'Harare',
                'description' => 'Seeking a DevOps engineer to build and maintain our CI/CD pipelines and cloud infrastructure on AWS.',
                'requirements' => "3+ years DevOps experience. Proficiency with AWS, Docker and Kubernetes. Experience with Terraform or CloudFormation.",
                'responsibilities' => "Manage cloud infrastructure. Automate deployment pipelines. Monitor system performance and implement security best practices.",
                'salary_min' => 2000,
                'salary_max' => 3000,
                'currency' => 'USD',
                'application_deadline' => '2026-04-15',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-02-20'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $techVentures,
                'title' => 'QA Automation Engineer',
                'department' => 'Quality Assurance',
                'category' => 'information_technology',
                'employment_type' => 'contract',
                'work_mode' => 'hybrid',
                'location' => 'Harare',
                'description' => 'Contract position for a QA engineer to set up automated testing frameworks for our product suite.',
                'requirements' => "2+ years QA automation experience. Proficiency with Selenium or Cypress. Knowledge of CI/CD integration for testing.",
                'responsibilities' => "Design and implement test automation frameworks. Write automated test scripts. Report bugs and track resolution.",
                'salary_min' => 1500,
                'salary_max' => 2200,
                'currency' => 'USD',
                'application_deadline' => '2026-03-31',
                'status' => 'draft',
                'published_at' => null,
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            // Greenfields Agri Holdings (3 vacancies)
            [
                'company_profile_id' => $greenfields,
                'title' => 'Agricultural Economist',
                'department' => 'Research',
                'category' => 'other',
                'employment_type' => 'full_time',
                'work_mode' => 'onsite',
                'location' => 'Chinhoyi',
                'description' => 'Seeking an agricultural economist to advise on crop economics, market trends and investment opportunities.',
                'requirements' => "MSc in Agricultural Economics or related field. 3+ years experience in agribusiness analysis. Strong analytical and research skills.",
                'responsibilities' => "Conduct market analysis for crop commodities. Advise on farm investment decisions. Prepare economic feasibility reports.",
                'salary_min' => 1800,
                'salary_max' => 2500,
                'currency' => 'USD',
                'application_deadline' => '2026-04-20',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-02-10'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $greenfields,
                'title' => 'Farm Operations Manager',
                'department' => 'Operations',
                'category' => 'operations',
                'employment_type' => 'full_time',
                'work_mode' => 'onsite',
                'location' => 'Chinhoyi',
                'description' => 'Experienced farm manager to oversee daily operations of a 2000-hectare mixed farming operation.',
                'requirements' => "5+ years farm management experience. Knowledge of crop rotation, irrigation systems and livestock management. Valid driver's licence.",
                'responsibilities' => "Manage farm labour and daily operations. Oversee planting, harvesting and marketing of crops. Maintain equipment and infrastructure.",
                'salary_min' => 2000,
                'salary_max' => 2800,
                'currency' => 'USD',
                'application_deadline' => '2026-04-10',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-02-25'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $greenfields,
                'title' => 'Accounts Clerk',
                'department' => 'Finance',
                'category' => 'accounting',
                'employment_type' => 'full_time',
                'work_mode' => 'onsite',
                'location' => 'Harare',
                'description' => 'Accounts clerk to assist with bookkeeping, invoicing and financial record-keeping.',
                'requirements' => "Diploma in Accounting or equivalent. 1+ year bookkeeping experience. Proficiency in Pastel or SAP.",
                'responsibilities' => "Process invoices and receipts. Reconcile bank statements. Prepare monthly financial reports for management.",
                'salary_min' => 800,
                'salary_max' => 1200,
                'currency' => 'USD',
                'application_deadline' => '2026-01-31',
                'status' => 'closed',
                'published_at' => Carbon::parse('2025-12-15'),
                'closed_at' => Carbon::parse('2026-02-01'),
                'created_by' => null,
                'updated_by' => null,
            ],
            // Mashonaland Mining Corp (3 vacancies)
            [
                'company_profile_id' => $mashonaland,
                'title' => 'Mining Engineer',
                'department' => 'Operations',
                'category' => 'engineering',
                'employment_type' => 'full_time',
                'work_mode' => 'onsite',
                'location' => 'Harare',
                'description' => 'Mining engineer for underground gold mining operations, responsible for mine design and production planning.',
                'requirements' => "BEng Mining Engineering. 5+ years underground mining experience. Blasting certificate and valid mine manager's ticket.",
                'responsibilities' => "Design underground mining layouts. Plan production schedules. Ensure compliance with mining safety regulations.",
                'salary_min' => 2500,
                'salary_max' => 3500,
                'currency' => 'USD',
                'application_deadline' => '2026-05-01',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-03-05'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $mashonaland,
                'title' => 'Safety Health & Environment Officer',
                'department' => 'SHE',
                'category' => 'other',
                'employment_type' => 'full_time',
                'work_mode' => 'onsite',
                'location' => 'Harare',
                'description' => 'SHE officer to manage safety programmes and ensure regulatory compliance at mining operations.',
                'requirements' => "Degree in Environmental Science or Occupational Health. 3+ years mining sector SHE experience. NEBOSH or equivalent certification.",
                'responsibilities' => "Conduct safety audits and inspections. Investigate incidents. Develop and implement SHE policies and training programmes.",
                'salary_min' => 1800,
                'salary_max' => 2500,
                'currency' => 'USD',
                'application_deadline' => '2026-04-25',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-03-01'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $mashonaland,
                'title' => 'Geology Graduate Trainee',
                'department' => 'Exploration',
                'category' => 'engineering',
                'employment_type' => 'internship',
                'work_mode' => 'onsite',
                'location' => 'Harare',
                'description' => 'Graduate trainee programme for geology graduates to gain hands-on experience in mineral exploration.',
                'requirements' => "BSc Geology or Mining Geology. Graduated within the last 2 years. Willingness to work in remote field locations.",
                'responsibilities' => "Assist with geological mapping and sampling. Support core logging and assay interpretation. Prepare geological reports.",
                'salary_min' => 600,
                'salary_max' => 900,
                'currency' => 'USD',
                'application_deadline' => '2026-03-15',
                'status' => 'closed',
                'published_at' => Carbon::parse('2026-01-10'),
                'closed_at' => Carbon::parse('2026-03-16'),
                'created_by' => null,
                'updated_by' => null,
            ],
            // ZimBuild Construction (3 vacancies)
            [
                'company_profile_id' => $zimBuild,
                'title' => 'Civil Engineer',
                'department' => 'Engineering',
                'category' => 'engineering',
                'employment_type' => 'full_time',
                'work_mode' => 'onsite',
                'location' => 'Harare',
                'description' => 'Civil engineer for infrastructure projects including roads, bridges and commercial buildings.',
                'requirements' => "BEng Civil Engineering. 3+ years post-qualification experience. Registered with the Engineering Council of Zimbabwe.",
                'responsibilities' => "Design structural elements. Supervise construction teams. Ensure projects meet quality and safety standards.",
                'salary_min' => 2000,
                'salary_max' => 2800,
                'currency' => 'USD',
                'application_deadline' => '2026-04-30',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-03-10'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $zimBuild,
                'title' => 'Quantity Surveyor',
                'department' => 'Commercial',
                'category' => 'engineering',
                'employment_type' => 'full_time',
                'work_mode' => 'onsite',
                'location' => 'Harare',
                'description' => 'Quantity surveyor to manage cost estimation, tendering and contract administration for construction projects.',
                'requirements' => "BSc Quantity Surveying. 4+ years experience in construction cost management. Proficiency in CCS Candy or similar software.",
                'responsibilities' => "Prepare bills of quantities. Manage project budgets. Negotiate with subcontractors and suppliers.",
                'salary_min' => 1800,
                'salary_max' => 2600,
                'currency' => 'USD',
                'application_deadline' => '2026-05-10',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-03-12'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $zimBuild,
                'title' => 'Site Foreman',
                'department' => 'Operations',
                'category' => 'operations',
                'employment_type' => 'contract',
                'work_mode' => 'onsite',
                'location' => 'Mutare',
                'description' => 'Experienced site foreman for a 12-month road rehabilitation project in the Eastern Highlands.',
                'requirements' => "Diploma in Civil Engineering or equivalent. 5+ years supervisory experience on road construction projects.",
                'responsibilities' => "Supervise daily construction activities. Manage site labour. Ensure adherence to project specifications and timelines.",
                'salary_min' => 1200,
                'salary_max' => 1800,
                'currency' => 'USD',
                'application_deadline' => '2026-02-28',
                'status' => 'closed',
                'published_at' => Carbon::parse('2026-01-05'),
                'closed_at' => Carbon::parse('2026-03-01'),
                'created_by' => null,
                'updated_by' => null,
            ],
            // First Capital Bank ZW (4 vacancies)
            [
                'company_profile_id' => $firstCapital,
                'title' => 'Financial Analyst',
                'department' => 'Corporate Banking',
                'category' => 'finance',
                'employment_type' => 'full_time',
                'work_mode' => 'onsite',
                'location' => 'Harare',
                'description' => 'Financial analyst to support corporate banking with credit analysis, financial modelling and deal structuring.',
                'requirements' => "BCom Finance or Accounting. CFA Level I or ACCA progress. 2+ years experience in banking or financial analysis.",
                'responsibilities' => "Analyse corporate credit applications. Build financial models for deal appraisal. Prepare credit committee presentations.",
                'salary_min' => 1800,
                'salary_max' => 2500,
                'currency' => 'USD',
                'application_deadline' => '2026-04-15',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-02-28'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $firstCapital,
                'title' => 'Digital Banking Product Manager',
                'department' => 'Digital Banking',
                'category' => 'information_technology',
                'employment_type' => 'full_time',
                'work_mode' => 'hybrid',
                'location' => 'Harare',
                'description' => 'Product manager to drive the roadmap for our mobile and internet banking platforms.',
                'requirements' => "3+ years product management experience in fintech or banking. Understanding of agile methodologies. Strong stakeholder management skills.",
                'responsibilities' => "Define product roadmap and feature priorities. Collaborate with engineering and design teams. Analyse user data to inform product decisions.",
                'salary_min' => 2200,
                'salary_max' => 3000,
                'currency' => 'USD',
                'application_deadline' => '2026-05-01',
                'status' => 'draft',
                'published_at' => null,
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $firstCapital,
                'title' => 'Sales Executive – Retail Banking',
                'department' => 'Retail Banking',
                'category' => 'sales',
                'employment_type' => 'full_time',
                'work_mode' => 'onsite',
                'location' => 'Bulawayo',
                'description' => 'Sales executive to drive retail product sales and build client relationships in the Bulawayo region.',
                'requirements' => "Diploma or degree in Marketing or Business. 2+ years sales experience preferably in banking or insurance. Valid driver's licence.",
                'responsibilities' => "Acquire new retail banking customers. Cross-sell bank products. Meet monthly and quarterly sales targets.",
                'salary_min' => 1000,
                'salary_max' => 1600,
                'currency' => 'USD',
                'application_deadline' => '2026-04-20',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-03-08'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $firstCapital,
                'title' => 'IT Support Specialist',
                'department' => 'Information Technology',
                'category' => 'information_technology',
                'employment_type' => 'full_time',
                'work_mode' => 'onsite',
                'location' => 'Harare',
                'description' => 'IT support specialist to provide helpdesk services and maintain branch network infrastructure.',
                'requirements' => "Diploma in IT or Computer Science. CompTIA A+ or equivalent. 2+ years IT support experience.",
                'responsibilities' => "Resolve helpdesk tickets. Maintain branch network equipment. Support core banking system users.",
                'salary_min' => 1000,
                'salary_max' => 1500,
                'currency' => 'USD',
                'application_deadline' => '2026-03-20',
                'status' => 'archived',
                'published_at' => Carbon::parse('2025-12-01'),
                'closed_at' => Carbon::parse('2026-01-31'),
                'created_by' => null,
                'updated_by' => null,
            ],
            // Innov8 Digital Solutions (3 vacancies)
            [
                'company_profile_id' => $innov8,
                'title' => 'Data Scientist',
                'department' => 'Data & Analytics',
                'category' => 'information_technology',
                'employment_type' => 'full_time',
                'work_mode' => 'remote',
                'location' => 'Harare',
                'description' => 'Data scientist to build machine learning models and analytics solutions for fintech clients.',
                'requirements' => "MSc in Data Science, Statistics or Computer Science. Proficiency in Python, TensorFlow and SQL. 3+ years ML experience.",
                'responsibilities' => "Develop predictive models. Analyse large datasets. Present insights and recommendations to clients.",
                'salary_min' => 2200,
                'salary_max' => 3000,
                'currency' => 'USD',
                'application_deadline' => '2026-05-15',
                'status' => 'draft',
                'published_at' => null,
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $innov8,
                'title' => 'UI/UX Designer',
                'department' => 'Design',
                'category' => 'information_technology',
                'employment_type' => 'full_time',
                'work_mode' => 'hybrid',
                'location' => 'Harare',
                'description' => 'UI/UX designer to create intuitive interfaces for mobile and web applications serving African markets.',
                'requirements' => "3+ years UI/UX design experience. Proficiency in Figma. Portfolio demonstrating mobile-first design work.",
                'responsibilities' => "Design user interfaces for mobile apps. Conduct user research and testing. Create design systems and component libraries.",
                'salary_min' => 1500,
                'salary_max' => 2200,
                'currency' => 'USD',
                'application_deadline' => '2026-04-30',
                'status' => 'published',
                'published_at' => Carbon::parse('2026-03-05'),
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
            [
                'company_profile_id' => $innov8,
                'title' => 'Digital Marketing Manager',
                'department' => 'Marketing',
                'category' => 'marketing',
                'employment_type' => 'full_time',
                'work_mode' => 'hybrid',
                'location' => 'Harare',
                'description' => 'Marketing manager to lead digital campaigns and brand growth for the agency and its clients.',
                'requirements' => "Degree in Marketing or Communications. 4+ years digital marketing experience. Proven track record with SEO, SEM and social media.",
                'responsibilities' => "Plan and execute digital marketing campaigns. Manage social media channels. Analyse campaign performance and optimise ROI.",
                'salary_min' => 1800,
                'salary_max' => 2500,
                'currency' => 'USD',
                'application_deadline' => '2026-04-25',
                'status' => 'draft',
                'published_at' => null,
                'closed_at' => null,
                'created_by' => null,
                'updated_by' => null,
            ],
        ];
    }

    // ──────────────────────────────────────────────
    //  Vacancy Applications
    // ──────────────────────────────────────────────

    private function seedVacancyApplications(array $vacancyIds, array $candidateIds, CarbonInterface $now): void
    {
        // Map: [vacancyIndex, candidateIndex, status, appliedDaysAgo, shortlistedDaysAgo|null, rejectedDaysAgo|null, coverLetter]
        $applications = [
            // Senior PHP Developer (vacancy 0) - 4 applications
            [0, 0, 'shortlisted', 28, 14, null, 'I bring 8 years of PHP and fintech experience directly relevant to this role. My work on the EcoCash and CBZ platforms demonstrates my ability to deliver enterprise-grade solutions.'],
            [0, 13, 'submitted', 10, null, null, 'As a junior developer eager to grow, I would welcome the opportunity to learn from your senior team while contributing my Laravel and React skills.'],
            [0, 10, 'interview', 25, 15, null, 'With extensive DevOps and PHP experience, I can contribute to both development and infrastructure aspects of your engineering team.'],
            [0, 4, 'under_review', 18, null, null, 'My data science background combined with strong Python and SQL skills would add analytical depth to your engineering team.'],

            // Junior Frontend Developer (vacancy 1) - 3 applications
            [1, 13, 'shortlisted', 15, 7, null, 'I have hands-on React experience from my work at Innov8 Digital and freelance projects. I am keen to grow as a frontend developer.'],
            [1, 8, 'submitted', 8, null, null, 'As a UI/UX designer with JavaScript and React skills, I can bridge the gap between design and frontend development.'],
            [1, 20, 'submitted', 5, null, null, 'I recently graduated with a BSc in Computer Science and have been building React applications as part of my portfolio.'],

            // DevOps Engineer (vacancy 2) - 3 applications
            [2, 10, 'offered', 30, 20, null, 'I have 7 years of DevOps experience with AWS, Docker and Kubernetes. My current role at Econet involves managing large-scale cloud infrastructure.'],
            [2, 0, 'under_review', 22, null, null, 'My software engineering background combined with infrastructure experience makes me a strong fit for this DevOps role.'],
            [2, 4, 'rejected', 28, 18, 10, 'I am interested in transitioning into DevOps, leveraging my strong Python and cloud computing skills.'],

            // Agricultural Economist (vacancy 4) - 2 applications
            [4, 11, 'interview', 35, 25, null, 'With an MSc in Agricultural Economics and 7 years advising on crop value chains, I am well suited to contribute to Greenfields\' research team.'],
            [4, 9, 'under_review', 20, null, null, 'My project management skills and MSc background would enable me to deliver rigorous economic analysis for your agricultural operations.'],

            // Farm Operations Manager (vacancy 5) - 2 applications
            [5, 24, 'shortlisted', 18, 10, null, 'With 16 years in manufacturing operations, I understand the rigour required to manage large-scale production environments including farming.'],
            [5, 19, 'submitted', 12, null, null, 'My logistics and supply chain management experience is directly applicable to farm operations management.'],

            // Mining Engineer (vacancy 7) - 3 applications
            [7, 2, 'interview', 12, 8, null, 'I have 10 years of underground mining experience including mine planning and safety compliance for gold and platinum operations.'],
            [7, 5, 'submitted', 7, null, null, 'As a civil engineer with infrastructure project experience, I am keen to apply my skills to mining engineering challenges.'],
            [7, 22, 'submitted', 5, null, null, 'As a recent mechanical engineering graduate, I am eager to begin my career in the mining industry.'],

            // SHE Officer (vacancy 8) - 2 applications
            [8, 9, 'under_review', 15, null, null, 'My PMP certification and project management background provide a strong foundation for managing safety programmes.'],
            [8, 5, 'withdrawn', 25, null, null, 'I have experience supervising construction sites where safety compliance is paramount.'],

            // Civil Engineer (vacancy 10) - 3 applications
            [10, 5, 'offered', 8, 5, null, 'I have 6 years of civil engineering experience delivering road, bridge and building projects across Zimbabwe with Lafarge and PPC.'],
            [10, 22, 'under_review', 6, null, null, 'As a mechanical engineering graduate, I have strong foundational engineering skills applicable to civil engineering projects.'],
            [10, 2, 'rejected', 7, 4, 2, 'My mining engineering background includes infrastructure development in challenging environments.'],

            // Quantity Surveyor (vacancy 11) - 2 applications
            [11, 7, 'submitted', 5, null, null, 'My chartered accounting background and financial management experience are transferable to quantity surveying cost management.'],
            [11, 16, 'submitted', 3, null, null, 'As a qualified accountant, I bring strong numerical and analytical skills to the cost estimation and contract administration aspects.'],

            // Financial Analyst (vacancy index 13) - 3 applications
            [13, 1, 'offered', 18, 12, null, 'I am a CFA Level II candidate with 6 years of financial analysis experience in banking. My work at NMB Bank directly aligns with this role.'],
            [13, 7, 'shortlisted', 15, 8, null, 'With 12 years in accounting and financial management, I offer deep expertise in financial analysis and reporting.'],
            [13, 16, 'under_review', 10, null, null, 'My accounting qualification and experience with tax and payroll provide a solid foundation for financial analysis.'],

            // Sales Executive (vacancy index 15) - 2 applications
            [15, 12, 'interview', 10, 6, null, 'I have 11 years of progressive sales experience in FMCG, including regional and national sales leadership roles.'],
            [15, 6, 'under_review', 8, null, null, 'My digital marketing expertise can complement traditional sales approaches to drive retail banking growth.'],

            // Data Scientist (vacancy index 17) - 2 applications
            [17, 4, 'submitted', 12, null, null, 'I have 7 years of data science experience with Python and ML, currently building predictive models for Econet Wireless.'],
            [17, 0, 'submitted', 10, null, null, 'My strong SQL and programming skills combined with analytical thinking make me a capable data science candidate.'],

            // UI/UX Designer (vacancy index 18) - 2 applications
            [18, 8, 'shortlisted', 12, 6, null, 'I have 4 years of UI/UX design experience creating mobile-first interfaces for fintech and healthtech startups in Africa.'],
            [18, 18, 'under_review', 8, null, null, 'My graphic design background and 3 years of experience provide strong visual design skills applicable to UI/UX work.'],

            // Digital Marketing Manager (vacancy index 19) - 2 applications
            [19, 6, 'submitted', 12, null, null, 'I have 5 years leading digital marketing operations including SEO, social media and content strategy at Nyaradzo.'],
            [19, 21, 'submitted', 8, null, null, 'As a recent marketing graduate, I am eager to apply my digital marketing coursework in a professional environment.'],
        ];

        $records = [];
        foreach ($applications as $app) {
            $appliedAt = Carbon::parse('2026-03-18')->subDays($app[3]);
            $shortlistedAt = $app[4] !== null ? Carbon::parse('2026-03-18')->subDays($app[4]) : null;
            $rejectedAt = $app[5] !== null ? Carbon::parse('2026-03-18')->subDays($app[5]) : null;

            $records[] = [
                'vacancy_id' => $vacancyIds[$app[0]],
                'candidate_profile_id' => $candidateIds[$app[1]],
                'resume_id' => null,
                'cover_letter' => $app[6],
                'status' => $app[2],
                'applied_at' => $appliedAt,
                'shortlisted_at' => $shortlistedAt,
                'rejected_at' => $rejectedAt,
                'notes' => null,
                'metadata' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('vacancy_applications')->insert($records);
    }

    // ──────────────────────────────────────────────
    //  Payments
    // ──────────────────────────────────────────────

    private function seedPayments(array $candidateIds, CarbonInterface $now): void
    {
        $records = [];

        // 12 paid payments for active candidates (indices 0-11)
        for ($i = 0; $i < 12; $i++) {
            $initiatedAt = Carbon::parse('2026-01-15')->addDays($i);
            $paidAt = $initiatedAt->copy()->addMinutes(rand(2, 15));

            $records[] = [
                'payable_type' => 'App\\Models\\CandidateProfile',
                'payable_id' => $candidateIds[$i],
                'user_id' => null,
                'amount' => 1.00,
                'currency' => 'USD',
                'provider' => $i % 4 === 0 ? 'manual' : 'paynow',
                'provider_reference' => $i % 4 === 0 ? 'MANUAL-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT) : 'PNW-' . strtoupper(substr(md5('payment-' . $i), 0, 12)),
                'customer_phone' => null,
                'customer_email' => null,
                'status' => 'paid',
                'initiated_at' => $initiatedAt,
                'paid_at' => $paidAt,
                'failed_at' => null,
                'metadata' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // 2 failed payments for candidates 12 and 13 (who later succeeded — these are earlier failed attempts)
        for ($i = 12; $i < 14; $i++) {
            $initiatedAt = Carbon::parse('2026-01-14')->addHours($i);
            $failedAt = $initiatedAt->copy()->addMinutes(5);

            $records[] = [
                'payable_type' => 'App\\Models\\CandidateProfile',
                'payable_id' => $candidateIds[$i],
                'user_id' => null,
                'amount' => 1.00,
                'currency' => 'USD',
                'provider' => 'paynow',
                'provider_reference' => 'PNW-FAIL-' . strtoupper(substr(md5('fail-' . $i), 0, 10)),
                'customer_phone' => null,
                'customer_email' => null,
                'status' => 'failed',
                'initiated_at' => $initiatedAt,
                'paid_at' => null,
                'failed_at' => $failedAt,
                'metadata' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // 1 pending payment for candidate 15 (Simbarashe Gumbo — pending_payment status)
        $records[] = [
            'payable_type' => 'App\\Models\\CandidateProfile',
            'payable_id' => $candidateIds[15],
            'user_id' => null,
            'amount' => 1.00,
            'currency' => 'USD',
            'provider' => 'paynow',
            'provider_reference' => 'PNW-PEND-' . strtoupper(substr(md5('pend-15'), 0, 10)),
            'customer_phone' => null,
            'customer_email' => null,
            'status' => 'pending',
            'initiated_at' => Carbon::parse('2026-03-17 14:30:00'),
            'paid_at' => null,
            'failed_at' => null,
            'metadata' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ];

        DB::table('payments')->insert($records);
    }

    private function seedSubscriptionPlans(CarbonInterface $now): array
    {
        $plans = [
            [
                'code' => 'starter',
                'name' => 'Starter',
                'description' => 'Basic hiring workflow for small teams.',
                'price' => 49.00,
                'currency' => 'USD',
                'billing_interval' => 'monthly',
                'seat_limit' => 3,
                'features' => ['3 active vacancies', 'Basic candidate pipeline', 'Email support'],
                'is_active' => true,
            ],
            [
                'code' => 'growth',
                'name' => 'Growth',
                'description' => 'Expanded recruiting workflow for growing employers.',
                'price' => 129.00,
                'currency' => 'USD',
                'billing_interval' => 'monthly',
                'seat_limit' => 10,
                'features' => ['15 active vacancies', 'Reporting dashboard', 'Priority support'],
                'is_active' => true,
            ],
            [
                'code' => 'enterprise',
                'name' => 'Enterprise',
                'description' => 'Unlimited hiring activity and advanced support.',
                'price' => 299.00,
                'currency' => 'USD',
                'billing_interval' => 'monthly',
                'seat_limit' => null,
                'features' => ['Unlimited vacancies', 'Advanced reports', 'Dedicated onboarding'],
                'is_active' => true,
            ],
        ];

        $ids = [];

        foreach ($plans as $plan) {
            $record = SubscriptionPlan::query()->updateOrCreate(
                ['code' => $plan['code']],
                [...$plan, 'updated_at' => $now, 'created_at' => $now],
            );

            $ids[$plan['code']] = $record->id;
        }

        return $ids;
    }

    private function seedDemoHubUsers(array $planIds, CarbonInterface $now): void
    {
        $candidateUser = User::query()->updateOrCreate(
            ['email' => 'candidate.demo@hrxhub.test'],
            [
                'name' => 'Rumbidzai Moyo',
                'password' => Hash::make('password'),
                'email_verified_at' => $now,
            ],
        );

        DB::table('candidate_profiles')->updateOrInsert(
            ['user_id' => $candidateUser->id],
            [
                'organization_id' => null,
                'requisition_code' => null,
                'full_name' => 'Rumbidzai Moyo',
                'email' => 'candidate.demo@hrxhub.test',
                'phone' => '+263 77 123 4567',
                'stage' => 'listed',
                'status' => 'available',
                'notes' => 'Seeded demo candidate for hub flows.',
                'alt_phone' => '+263 78 765 4321',
                'national_id' => '63-123456A63',
                'gender' => 'female',
                'date_of_birth' => '1998-04-12',
                'location' => 'Harare, Zimbabwe',
                'headline' => 'Frontend Developer - React - TypeScript',
                'professional_summary' => 'Product-focused frontend developer with experience building modern web applications, design systems, and user-friendly dashboards across HR and recruitment platforms.',
                'expected_salary' => 2200.00,
                'salary_currency' => 'USD',
                'years_experience' => 5,
                'highest_education' => 'bachelors',
                'profile_visibility_status' => 'active',
                'is_public' => true,
                'is_verified' => true,
                'listing_fee_amount' => 1.00,
                'listing_fee_currency' => 'USD',
                'listing_activated_at' => Carbon::parse('2026-01-10 09:00:00'),
                'listing_expires_at' => Carbon::parse('2026-06-30 23:59:59'),
                'metadata' => json_encode([
                    'profile_views' => 146,
                    'preferences' => [
                        'job_alerts' => true,
                        'newsletter' => false,
                        'remote_only' => false,
                        'preferred_work_modes' => ['remote', 'hybrid'],
                    ],
                ], JSON_THROW_ON_ERROR),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );

        $candidateId = DB::table('candidate_profiles')->where('user_id', $candidateUser->id)->value('id');

        DB::table('candidate_educations')->updateOrInsert(
            ['candidate_profile_id' => $candidateId, 'institution' => 'University of Zimbabwe', 'qualification' => 'BSc Computer Science'],
            [
                'field_of_study' => 'Software Engineering',
                'start_date' => '2016-08-01',
                'end_date' => '2020-11-30',
                'grade' => '2.1',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );

        DB::table('candidate_educations')->updateOrInsert(
            ['candidate_profile_id' => $candidateId, 'institution' => 'Google Career Certificates', 'qualification' => 'UX Design Certificate'],
            [
                'field_of_study' => 'UX Design',
                'start_date' => '2022-01-01',
                'end_date' => '2022-06-30',
                'grade' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );

        DB::table('candidate_experiences')->updateOrInsert(
            ['candidate_profile_id' => $candidateId, 'employer_name' => 'Providence Digital', 'job_title' => 'Frontend Developer'],
            [
                'start_date' => '2023-01-01',
                'end_date' => null,
                'currently_working' => true,
                'description' => 'Building internal dashboards, candidate portals, and HR workflow tools using React, TypeScript, and Tailwind CSS.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );

        DB::table('candidate_experiences')->updateOrInsert(
            ['candidate_profile_id' => $candidateId, 'employer_name' => 'ZimTech Solutions', 'job_title' => 'Junior Web Developer'],
            [
                'start_date' => '2020-02-01',
                'end_date' => '2022-12-01',
                'currently_working' => false,
                'description' => 'Worked on company websites, recruitment landing pages, and CMS integrations for business clients.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );

        foreach ([
            ['React', 'expert', 5],
            ['TypeScript', 'advanced', 4],
            ['Tailwind CSS', 'advanced', 4],
            ['JavaScript', 'expert', 5],
            ['UI Design', 'intermediate', 3],
            ['Figma', 'intermediate', 3],
            ['Inertia.js', 'intermediate', 2],
            ['Laravel', 'beginner', 1],
        ] as [$name, $level, $years]) {
            DB::table('candidate_skills')->updateOrInsert(
                ['candidate_profile_id' => $candidateId, 'name' => $name],
                [
                    'level' => $level,
                    'years_experience' => $years,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }

        foreach ([
            ['Rumbidzai_Moyo_CV_2026.pdf', 'resume', 'Primary CV', true, '2026-01-15 10:00:00'],
            ['Rumbidzai_Moyo_Portfolio.pdf', 'portfolio', 'Portfolio highlights', false, '2026-02-01 09:00:00'],
            ['Rumbidzai_Moyo_Resume_Design.pdf', 'resume', 'Design-focused resume', false, '2026-02-20 16:00:00'],
        ] as [$fileName, $documentType, $description, $isPrimary, $uploadedAt]) {
            DB::table('candidate_resumes')->updateOrInsert(
                ['candidate_profile_id' => $candidateId, 'file_name' => $fileName],
                [
                    'document_type' => $documentType,
                    'file_path' => 'seeded/'.$candidateId.'/'.$fileName,
                    'description' => $description,
                    'mime_type' => 'application/pdf',
                    'size' => 102400,
                    'is_primary' => $isPrimary,
                    'uploaded_by' => $candidateUser->id,
                    'uploaded_at' => Carbon::parse($uploadedAt),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }

        $employerUser = User::query()->updateOrCreate(
            ['email' => 'employer.demo@hrxhub.test'],
            [
                'name' => 'Amanda Ncube',
                'password' => Hash::make('password'),
                'email_verified_at' => $now,
            ],
        );

        CompanyProfile::withoutGlobalScopes()->updateOrCreate(
            ['owner_user_id' => $employerUser->id],
            [
                'organization_id' => null,
                'company_name' => 'Providence HR',
                'industry' => 'information_technology',
                'registration_number' => 'ZW-2026-HRX-001',
                'email' => 'amanda@providencehr.co.zw',
                'phone' => '+263 242 881100',
                'website' => 'https://www.providencehr.co.zw',
                'address' => 'Borrowdale Road, Harare',
                'description' => 'Recruitment and HR technology company focused on employer and candidate self-service workflows.',
                'logo_path' => null,
                'status' => 'active',
                'approved_at' => Carbon::parse('2026-01-05 08:00:00'),
                'metadata' => [
                    'team_size' => 7,
                    'plan_label' => 'Growth',
                ],
                'created_by' => $employerUser->id,
                'updated_by' => $employerUser->id,
            ],
        );

        $companyId = CompanyProfile::withoutGlobalScopes()
            ->where('owner_user_id', $employerUser->id)
            ->value('id');

        DB::table('company_billing_profiles')->updateOrInsert(
            ['company_profile_id' => $companyId],
            [
                'billing_name' => 'Providence HR Finance',
                'billing_email' => 'billing@providencehr.co.zw',
                'billing_phone' => '+263 242 881199',
                'billing_address' => 'Borrowdale Road, Harare',
                'tax_number' => 'TIN-PRV-HR-2026',
                'metadata' => json_encode(['contact_person' => 'Amanda Ncube'], JSON_THROW_ON_ERROR),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );

        DB::table('company_subscriptions')->updateOrInsert(
            ['company_profile_id' => $companyId, 'status' => 'active'],
            [
                'subscription_plan_id' => $planIds['growth'],
                'seats' => 7,
                'amount' => 129.00,
                'currency' => 'USD',
                'started_at' => Carbon::parse('2026-01-01 00:00:00'),
                'renews_at' => Carbon::parse('2026-04-01 00:00:00'),
                'cancelled_at' => null,
                'metadata' => json_encode(['renewal_day' => 1], JSON_THROW_ON_ERROR),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );

        $subscriptionId = DB::table('company_subscriptions')
            ->where('company_profile_id', $companyId)
            ->where('status', 'active')
            ->value('id');

        foreach ([
            ['INV-2026-0001', 129.00, 'paid', '2026-01-01 00:00:00', '2026-01-07 00:00:00', '2026-01-02 09:00:00', 'Growth plan subscription'],
            ['INV-2026-0002', 129.00, 'paid', '2026-02-01 00:00:00', '2026-02-07 00:00:00', '2026-02-03 11:30:00', 'Growth plan subscription'],
            ['INV-2026-0003', 129.00, 'pending', '2026-03-01 00:00:00', '2026-03-07 00:00:00', null, 'Growth plan subscription'],
        ] as [$invoiceNumber, $amount, $status, $issuedAt, $dueAt, $paidAt, $description]) {
            DB::table('company_invoices')->updateOrInsert(
                ['invoice_number' => $invoiceNumber],
                [
                    'company_profile_id' => $companyId,
                    'company_subscription_id' => $subscriptionId,
                    'amount' => $amount,
                    'currency' => 'USD',
                    'status' => $status,
                    'description' => $description,
                    'issued_at' => Carbon::parse($issuedAt),
                    'due_at' => Carbon::parse($dueAt),
                    'paid_at' => $paidAt ? Carbon::parse($paidAt) : null,
                    'metadata' => json_encode(['source' => 'recruitment_seeder'], JSON_THROW_ON_ERROR),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }

        foreach ([
            ['Senior Frontend Developer', 'Engineering', 'information_technology', 'full_time', 'hybrid', 'Harare', 2100, 2900, 'published', '2026-02-10'],
            ['UI Engineer', 'Product', 'information_technology', 'contract', 'remote', 'Remote', 1800, 2500, 'published', '2026-02-18'],
            ['Product Designer', 'Design', 'marketing', 'full_time', 'onsite', 'Harare', 1600, 2400, 'draft', null],
            ['HR Business Partner', 'Human Resources', 'human_resources', 'full_time', 'hybrid', 'Bulawayo', 1900, 2600, 'published', '2026-03-01'],
        ] as [$title, $department, $category, $employmentType, $workMode, $location, $salaryMin, $salaryMax, $status, $publishedAt]) {
            DB::table('vacancies')->updateOrInsert(
                ['company_profile_id' => $companyId, 'title' => $title],
                [
                    'department' => $department,
                    'category' => $category,
                    'employment_type' => $employmentType,
                    'work_mode' => $workMode,
                    'location' => $location,
                    'description' => $title.' vacancy for Providence HR seeded for dashboard functionality.',
                    'requirements' => 'Relevant experience, strong communication, and the ability to collaborate across teams.',
                    'responsibilities' => 'Deliver strong hiring outcomes, collaborate with stakeholders, and maintain a high-quality candidate experience.',
                    'salary_min' => $salaryMin,
                    'salary_max' => $salaryMax,
                    'currency' => 'USD',
                    'application_deadline' => Carbon::parse('2026-05-30')->toDateString(),
                    'status' => $status,
                    'published_at' => $publishedAt ? Carbon::parse($publishedAt) : null,
                    'closed_at' => null,
                    'created_by' => $employerUser->id,
                    'updated_by' => $employerUser->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }

        $vacancies = DB::table('vacancies')
            ->where('company_profile_id', $companyId)
            ->pluck('id', 'title');

        $primaryResumeId = DB::table('candidate_resumes')
            ->where('candidate_profile_id', $candidateId)
            ->where('is_primary', true)
            ->value('id');

        foreach ([
            ['Senior Frontend Developer', 'shortlisted', '2026-02-10 12:00:00', 'Shortlisted for technical review.'],
            ['UI Engineer', 'interview', '2026-02-18 09:30:00', 'Interview panel scheduled.'],
            ['HR Business Partner', 'submitted', '2026-03-02 08:15:00', 'Awaiting recruiter review.'],
        ] as [$vacancyTitle, $status, $appliedAt, $notes]) {
            DB::table('vacancy_applications')->updateOrInsert(
                ['vacancy_id' => $vacancies[$vacancyTitle], 'candidate_profile_id' => $candidateId],
                [
                    'resume_id' => $primaryResumeId,
                    'cover_letter' => 'I am excited to apply for the '.$vacancyTitle.' role and believe my recent experience aligns strongly with the team’s needs.',
                    'status' => $status,
                    'applied_at' => Carbon::parse($appliedAt),
                    'shortlisted_at' => $status === 'shortlisted' || $status === 'interview' ? Carbon::parse($appliedAt)->addDays(4) : null,
                    'rejected_at' => null,
                    'notes' => $notes,
                    'metadata' => json_encode(['source' => 'demo_hub_seed'], JSON_THROW_ON_ERROR),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }

        $uiEngineerApplicationId = DB::table('vacancy_applications')
            ->where('vacancy_id', $vacancies['UI Engineer'])
            ->where('candidate_profile_id', $candidateId)
            ->value('id');

        if ($uiEngineerApplicationId) {
            DB::table('application_interviews')->updateOrInsert(
                [
                    'vacancy_application_id' => $uiEngineerApplicationId,
                    'scheduled_at' => Carbon::parse('2026-03-26 10:00:00'),
                ],
                [
                    'company_profile_id' => $companyId,
                    'candidate_profile_id' => $candidateId,
                    'vacancy_id' => $vacancies['UI Engineer'],
                    'ends_at' => Carbon::parse('2026-03-26 11:00:00'),
                    'timezone' => config('app.timezone', 'UTC'),
                    'meeting_type' => 'video',
                    'location' => 'Google Meet',
                    'instructions' => 'Join five minutes early, test your audio, and prepare to discuss your recent React and TypeScript delivery work.',
                    'status' => 'scheduled',
                    'responded_at' => null,
                    'candidate_response_note' => null,
                    'created_by' => $employerUser->id,
                    'updated_by' => $employerUser->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }

        DB::table('payments')->updateOrInsert(
            ['payable_type' => 'App\\Models\\CandidateProfile', 'payable_id' => $candidateId, 'provider_reference' => 'DEMO-CANDIDATE-001'],
            [
                'user_id' => $candidateUser->id,
                'amount' => 1.00,
                'currency' => 'USD',
                'provider' => 'manual',
                'customer_phone' => '+263 77 123 4567',
                'customer_email' => 'candidate.demo@hrxhub.test',
                'status' => 'paid',
                'initiated_at' => Carbon::parse('2026-01-10 09:00:00'),
                'paid_at' => Carbon::parse('2026-01-10 09:05:00'),
                'failed_at' => null,
                'metadata' => json_encode(['source' => 'demo_hub_seed'], JSON_THROW_ON_ERROR),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );
    }
}
