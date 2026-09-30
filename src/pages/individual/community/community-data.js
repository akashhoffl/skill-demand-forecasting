export const communityNavigation = [
  { id: 'discover', label: 'Discover', icon: 'compass' },
  { id: 'mine', label: 'My communities', icon: 'users-round' },
  { id: 'discussions', label: 'Discussions', icon: 'messages-square' },
  { id: 'challenges', label: 'Challenges', icon: 'flag-triangle-right' },
  { id: 'projects', label: 'Projects', icon: 'blocks' },
  { id: 'mentors', label: 'Mentors', icon: 'user-round-check' },
  { id: 'events', label: 'Events', icon: 'calendar-days' },
  { id: 'opportunities', label: 'Opportunities', icon: 'move-up-right' }
];

export const communityCatalog = [
  { id: 'python', name: 'Python', skill: 'Python', category: 'Programming', focus: 'Backend, data and automation', icon: 'code-xml', tags: ['Python', 'Backend', 'FastAPI', 'Data'], members: '12.4k', discussions: 248, challenges: 18, events: 3, activity: 'A new API design thread is active', accent: 'plum' },
  { id: 'machine-learning', name: 'Machine Learning', skill: 'Machine Learning', category: 'AI and data', focus: 'Models, evaluation and deployment', icon: 'brain-circuit', tags: ['Machine Learning', 'Python', 'AI', 'Deep Learning', 'PyTorch'], members: '8.2k', discussions: 136, challenges: 12, events: 2, activity: 'Model evaluation clinic this week', accent: 'orchid' },
  { id: 'backend', name: 'Backend Development', skill: 'Backend', category: 'Software engineering', focus: 'APIs, services and system design', icon: 'server-cog', tags: ['Backend', 'Python', 'FastAPI', 'Java', 'System Design'], members: '6.7k', discussions: 104, challenges: 9, events: 2, activity: 'REST API review room is open', accent: 'grape' },
  { id: 'data-science', name: 'Data Science', skill: 'Data Science', category: 'Data', focus: 'Analysis, experiments and storytelling', icon: 'chart-no-axes-combined', tags: ['Data Science', 'SQL', 'Machine Learning', 'Python'], members: '5.6k', discussions: 92, challenges: 8, events: 1, activity: 'Notebook peer review is open', accent: 'plum' },
  { id: 'cloud', name: 'Cloud Engineering', skill: 'Cloud Computing', category: 'Infrastructure', focus: 'Cloud architecture and reliability', icon: 'cloud-cog', tags: ['Cloud Computing', 'AWS', 'Backend', 'Cybersecurity'], members: '4.3k', discussions: 77, challenges: 7, events: 2, activity: 'Deployment patterns discussion', accent: 'orchid' },
  { id: 'cybersecurity', name: 'Cybersecurity', skill: 'Cybersecurity', category: 'Security', focus: 'Threat modeling and secure systems', icon: 'shield-check', tags: ['Cybersecurity', 'Cloud Security', 'Backend'], members: '3.9k', discussions: 64, challenges: 6, events: 1, activity: 'Threat-model walkthrough', accent: 'grape' },
  { id: 'embedded', name: 'Embedded Systems', skill: 'Embedded Systems', category: 'ECE and hardware', focus: 'Firmware, circuits and edge devices', icon: 'cpu', tags: ['Embedded Systems', 'ECE', 'Electronics', 'C'], members: '2.8k', discussions: 49, challenges: 5, events: 1, activity: 'Sensor-interface build session', accent: 'plum' },
  { id: 'electrical', name: 'Electrical Engineering', skill: 'Electrical Engineering', category: 'Core engineering', focus: 'Power, control and circuit design', icon: 'activity', tags: ['Electrical Engineering', 'ECE', 'Electronics', 'Control Systems'], members: '2.2k', discussions: 38, challenges: 4, events: 1, activity: 'Motor-control design review', accent: 'orchid' },
  { id: 'mechanical', name: 'Mechanical Design', skill: 'Mechanical Engineering', category: 'Core engineering', focus: 'CAD, materials and product design', icon: 'settings-2', tags: ['Mechanical Engineering', 'CAD', 'Manufacturing', 'Design'], members: '1.9k', discussions: 31, challenges: 3, events: 1, activity: 'Design-for-assembly discussion', accent: 'grape' }
];

export const communityDiscussionCatalog = [
  { id: 'fastapi-layout', title: 'How should I structure a production FastAPI project?', communityId: 'python', skills: ['Python', 'FastAPI', 'Backend'], type: 'Question', author: 'Nila', authorRole: 'Backend developer', time: '34 min ago', body: 'I am splitting a small service into routers, models and business logic. What boundaries have made a FastAPI codebase easier to test as it grows?', replies: 24, reactions: 18, status: 'Solved', mentorResponse: true, companyResponse: false, roadmapRelated: true, answers: [{ id: 'answer-fastapi-1', author: 'Sam', role: 'Python community member', text: 'Keep transport concerns in routers, move business rules into services, and make dependencies injectable so tests can replace database and network clients.', helpful: 8, accepted: true, label: 'Accepted answer' }, { id: 'answer-fastapi-2', author: 'Mira', role: 'Community mentor demo profile', text: 'Start with the simplest boundaries your tests need. Split modules when ownership or dependencies differ, not just to create folders.', helpful: 4, accepted: false, label: 'Mentor perspective, demo' }] },
  { id: 'async-ml', title: 'Where should async tasks live in an ML service?', communityId: 'machine-learning', skills: ['Machine Learning', 'Python', 'Backend'], type: 'Technical discussion', author: 'Dev', authorRole: 'ML practitioner', time: '2 hr ago', body: 'I am comparing background workers with request-scoped tasks for inference pipelines. What tradeoffs should I consider for retries and observability?', replies: 11, reactions: 9, status: 'Open', mentorResponse: false, companyResponse: false, roadmapRelated: true, answers: [] },
  { id: 'model-monitoring', title: 'What is useful evidence that a model is drifting?', communityId: 'machine-learning', skills: ['Machine Learning', 'Data Science', 'Python'], type: 'Project discussion', author: 'Arun', authorRole: 'Community member', time: 'Yesterday', body: 'I have a small classification project and want a practical monitoring checklist. Which data and model signals would you review first?', replies: 7, reactions: 12, status: 'Open', mentorResponse: false, companyResponse: true, roadmapRelated: false, answers: [{ id: 'answer-monitoring-1', author: 'Leena', role: 'Data community member', text: 'Track input distributions, prediction confidence, delayed labels and performance by important slices. Keep the baseline and review window explicit.', helpful: 5, accepted: false, label: 'Helpful answer' }] },
  { id: 'circuit-isolation', title: 'How do you isolate noisy sensor readings in a motor controller?', communityId: 'embedded', skills: ['Embedded Systems', 'Electrical Engineering', 'ECE'], type: 'Domain discussion', author: 'Ishan', authorRole: 'ECE learner', time: 'Yesterday', body: 'Looking for practical ways to separate switching noise from useful sensor data before changing the board layout.', replies: 6, reactions: 5, status: 'Open', mentorResponse: false, companyResponse: false, roadmapRelated: false, answers: [] },
  { id: 'sql-indexes', title: 'Which query plan clues tell you an index is not helping?', communityId: 'data-science', skills: ['SQL', 'Data Science', 'Backend'], type: 'Resource discussion', author: 'Jo', authorRole: 'Data engineer', time: '2 days ago', body: 'Share examples of reading query plans when a seemingly relevant index still leaves a slow scan.', replies: 14, reactions: 10, status: 'Answered', mentorResponse: false, companyResponse: false, roadmapRelated: false, answers: [] }
];

export const communityChallengeCatalog = [
  { id: 'rest-api', title: 'Build a resilient REST API', communityId: 'python', skills: ['Python', 'FastAPI', 'Backend', 'SQL'], difficulty: 'Intermediate', participants: 248, daysFromNow: 4, status: 'Open', timeEstimate: '3 to 5 hours', reward: 'Peer-reviewed project evidence', company: '', mentor: '', problem: 'Build a small API with clear validation, useful errors and tests that explain its behavior.', outcome: 'A documented API with a short test suite and a note about one design tradeoff.', rules: ['Use a framework you can explain.', 'Do not include secrets or private data.', 'Describe how you tested the main failure paths.'], criteria: ['Clear API boundaries', 'Meaningful tests', 'Readable project notes'] },
  { id: 'model-card', title: 'Explain a model with a clear model card', communityId: 'machine-learning', skills: ['Machine Learning', 'Python', 'Data Science'], difficulty: 'Intermediate', participants: 136, daysFromNow: 8, status: 'Open', timeEstimate: '4 to 6 hours', reward: 'Community review and skill evidence', company: '', mentor: '', problem: 'Choose a small public or synthetic dataset and document a model, its limits and the checks you performed.', outcome: 'A reproducible notebook and a concise model card.', rules: ['Use public or synthetic data only.', 'Document known limitations.', 'Include a reproducibility note.'], criteria: ['Sound evaluation split', 'Clear limitations', 'Reproducible steps'] },
  { id: 'circuit-debug', title: 'Debug a sensor interface', communityId: 'embedded', skills: ['Embedded Systems', 'Electrical Engineering', 'ECE'], difficulty: 'Advanced', participants: 49, daysFromNow: 12, status: 'Upcoming', timeEstimate: 'A weekend', reward: 'Peer feedback', company: '', mentor: '', problem: 'Trace a noisy sensor input through a small control circuit and propose a testable improvement.', outcome: 'A circuit note with assumptions and a test plan.', rules: ['Use a simulation or safe low-voltage prototype.', 'Explain assumptions and measurements.'], criteria: ['Correct signal reasoning', 'Safe test plan', 'Useful diagrams or notes'] },
  { id: 'cuda-kernel', title: 'Compare two GPU kernels', communityId: 'machine-learning', skills: ['Machine Learning', 'CUDA', 'Python'], difficulty: 'Advanced', participants: 52, daysFromNow: 0, status: 'Under Review', timeEstimate: '6 to 8 hours', reward: 'Review feedback', company: 'NVIDIA challenge concept, demo only', mentor: '', problem: 'Compare two simple GPU implementations with a repeatable benchmark and an explanation of the result.', outcome: 'A benchmark note with source and reproducibility steps.', rules: ['Use public sample inputs.', 'Report environment assumptions.', 'Do not present the demo company concept as a real partnership.'], criteria: ['Repeatable method', 'Fair comparison', 'Clear interpretation'] }
];

export const communityProjectCatalog = [
  { id: 'resume-analyzer', title: 'Open-source resume feedback tool', communityId: 'python', skills: ['Python', 'NLP', 'FastAPI'], creator: 'Arun', contributors: 2, status: 'Looking for collaborators', lookingFor: ['Frontend developer', 'NLP contributor'], feedback: 6, reactions: 14, completed: false, problem: 'Help people make project experience easier to explain with private, local-first feedback.', technology: 'Python, FastAPI and NLP', link: '', notes: 'A community demo project concept. No real repository is connected.' },
  { id: 'model-observer', title: 'Small model observability kit', communityId: 'machine-learning', skills: ['Machine Learning', 'Python', 'Data Science'], creator: 'Dev', contributors: 3, status: 'In progress', lookingFor: ['Data contributor'], feedback: 9, reactions: 17, completed: false, problem: 'Make basic model evaluation and drift checks easier to reproduce.', technology: 'Python notebooks and a small service', link: '', notes: 'Illustrative community project data.' },
  { id: 'sensor-lab', title: 'Low-cost sensor test bench', communityId: 'embedded', skills: ['Embedded Systems', 'Electrical Engineering', 'ECE'], creator: 'Ishan', contributors: 2, status: 'Peer reviewed', lookingFor: [], feedback: 4, reactions: 8, completed: true, problem: 'Compare sensor readings under controlled noise conditions.', technology: 'Microcontroller, sensors and a documented test plan', link: '', notes: 'Illustrative project with a completed peer review.' }
];

export const communityMentorCatalog = [
  {
    id: 'mentor-arun',
    employeeId: 'EMP-88291',
    name: 'Arun Sharma',
    company: 'NVIDIA Enterprise Solutions',
    companyId: 'ORG-NV-2026',
    domain: 'High-Throughput ML Serving & Systems',
    expertise: 'Async inference pipelines, PyTorch DDP, and Triton model packaging',
    skills: ['Python', 'PyTorch', 'Generative AI', 'CUDA'],
    experience: '4.5 Years Systems Experience at NVIDIA',
    availability: '2 Mock Interview Slots Available',
    sessions: ['Technical Mock Interview', 'Code & Architecture Review', 'Inference Optimization'],
    communityIds: ['python', 'machine-learning'],
    bio: 'Lead AI Engineer at NVIDIA specializing in low-latency model packaging and asynchronous inference pipelines. Hosts mock technical interviews for systems candidates.',
    rating: 4.9,
    verifiedEmployee: true,
    availableSlots: [
      { id: 'slot-1', date: 'Tomorrow, Sep 29', time: '5:00 PM — 5:45 PM IST', format: 'Technical Mock Interview', focusArea: 'Distributed ML Serving & Inference Architecture' },
      { id: 'slot-2', date: 'Thursday, Oct 1', time: '6:00 PM — 6:45 PM IST', format: 'Code & Architecture Review', focusArea: 'Python Async Systems & Production Triton Pipelines' }
    ]
  },
  {
    id: 'mentor-david',
    employeeId: 'EMP-74109',
    name: 'David Chen',
    company: 'NVIDIA Enterprise Solutions',
    companyId: 'ORG-NV-2026',
    domain: 'CUDA Compilers & Microarchitecture',
    expertise: 'GPU kernel memory bank conflicts, WMMA tensor cores, and NVLink',
    skills: ['CUDA', 'Distributed Systems', 'C++'],
    experience: '8 Years at NVIDIA Silicon Architecture',
    availability: '1 Mock Session Slot Available',
    sessions: ['Architectural System Design', 'CUDA Memory Profiling', 'Silicon Deep Dive'],
    communityIds: ['embedded', 'machine-learning'],
    bio: 'Distinguished Architect leading Blackwell B200 compiler tuning. Specializes in low-level memory bank conflicts and NVLink topologies.',
    rating: 5.0,
    verifiedEmployee: true,
    availableSlots: [
      { id: 'slot-3', date: 'Friday, Oct 2', time: '4:00 PM — 4:45 PM IST', format: 'Architectural System Design', focusArea: 'CUDA Shared Memory & NVLink Interconnects' }
    ]
  },
  { id: 'mentor-mira', name: 'Mira', domain: 'Backend engineering', expertise: 'API design and testing', skills: ['Python', 'FastAPI', 'Backend'], experience: 'Practice focus: service design and testing', availability: 'Community Reviewer', sessions: ['Q&A', 'Project review', 'Technical review'], communityIds: ['python', 'backend'], bio: 'Community mentor focusing on clean architectural boundaries, modular FastAPI services, and automated test pipelines.' },
  { id: 'mentor-leena', name: 'Leena', domain: 'Machine learning', expertise: 'Model evaluation and deployment', skills: ['Machine Learning', 'Python', 'Data Science'], experience: 'Practice focus: evaluation and deployment workflows', availability: 'Community Reviewer', sessions: ['Q&A', 'Project review', 'Career guidance'], communityIds: ['machine-learning', 'data-science'], bio: 'Community mentor specializing in model evaluation workflows and deployment reliability.' },
  { id: 'mentor-omar', name: 'Omar', domain: 'Embedded systems', expertise: 'Firmware and sensor interfaces', skills: ['Embedded Systems', 'Electrical Engineering', 'ECE'], experience: 'Practice focus: firmware and hardware testing', availability: 'Community Reviewer', sessions: ['Q&A', 'Technical review', 'Challenge review'], communityIds: ['embedded', 'electrical'], bio: 'Community mentor specializing in firmware and hardware testing.' }
];


export const communityEventCatalog = [
  { id: 'python-study', title: 'Python async study room', communityId: 'python', type: 'Study session', daysFromNow: 3, time: '6:00 PM IST', host: 'Python community demo host', skills: ['Python', 'Backend'], location: 'Online', participants: 18, registered: false, notes: 'Illustrative event. No live event or host connection is available.' },
  { id: 'model-review', title: 'Model evaluation clinic', communityId: 'machine-learning', type: 'Workshop', daysFromNow: 6, time: '5:30 PM IST', host: 'Machine Learning community demo host', skills: ['Machine Learning', 'Python'], location: 'Online', participants: 24, registered: false, notes: 'Illustrative event. Registration is stored only in this browser prototype.' },
  { id: 'circuit-meetup', title: 'Sensor interface design review', communityId: 'embedded', type: 'Technical meetup', daysFromNow: 9, time: '11:00 AM IST', host: 'Embedded Systems community demo host', skills: ['Embedded Systems', 'Electrical Engineering'], location: 'Online', participants: 12, registered: false, notes: 'Illustrative event with no external organizer connection.' }
];

export const communityOpportunityCatalog = [
  { id: 'ai-challenge', title: 'AI engineering build challenge', organizer: 'NVIDIA challenge concept, demo only', role: 'AI Engineer', skills: ['Python', 'Machine Learning', 'CUDA'], location: 'Online', type: 'Company challenge concept', communityId: 'machine-learning', connection: 'Practice brief connected to the Machine Learning community. No hiring or company partnership is implied.' },
  { id: 'backend-collab', title: 'Contribute to the API observability project', organizer: 'Python community project', role: 'Backend collaborator', skills: ['Python', 'FastAPI', 'Backend'], location: 'Remote', type: 'Collaboration', communityId: 'python', connection: 'An open contribution path in a community demo project.' },
  { id: 'mentor-review', title: 'Request a portfolio review circle', organizer: 'Backend community', role: 'Peer and mentor feedback', skills: ['Python', 'Backend', 'System Design'], location: 'Online', type: 'Mentorship', communityId: 'backend', connection: 'A prototype request flow, not a confirmed mentor appointment.' },
  { id: 'embedded-hack', title: 'Community sensor prototype sprint', organizer: 'Embedded Systems community', role: 'Project contributor', skills: ['Embedded Systems', 'ECE', 'Electrical Engineering'], location: 'Online', type: 'Hackathon concept', communityId: 'embedded', connection: 'Illustrative community activity, not a scheduled real-world event.' }
];
