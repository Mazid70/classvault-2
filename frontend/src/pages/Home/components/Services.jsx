import {
  FaLock,
  FaBookOpen,
  FaFileAlt,
  FaComments,
  FaBell,
  FaChartPie,
} from 'react-icons/fa';
const iconMap = {
  FaLock,
  FaBookOpen,
  FaFileAlt,
  FaComments,
  FaBell,
  FaChartPie,
};
const features = [
  {
    id: 1,
    title: 'Secure Note Vault',
    icon: 'FaLock',
    description:
      'Your notes and study materials are safely stored in a secure digital vault. Only verified students from your section can access and share resources.',
  },
  {
    id: 2,
    title: 'Smart Study Material Sharing',
    icon: 'FaBookOpen',
    description:
      'Upload, organize, and access notes, PDFs, and lab materials by subject, keeping everything structured for efficient studying.',
  },
  {
    id: 3,
    title: 'Assignment & Cover Page Generator',
    icon: 'FaFileAlt',
    description:
      'Generate professional assignment and lab report cover pages instantly based on your university format with zero manual effort.',
  },
  {
    id: 4,
    title: 'Interactive Comments & Reactions',
    icon: 'FaComments',
    description:
      'Engage with classmates through comments and reactions to clarify doubts, share feedback, and collaborate effectively.',
  },
  {
    id: 5,
    title: 'Real-Time Notifications',
    icon: 'FaBell',
    description:
      'Receive instant notifications for new notes, comments, approvals, and important academic updates.',
  },
  {
    id: 6,
    title: 'Personal Dashboard & Progress Tracking',
    icon: 'FaChartPie',
    description:
      'Monitor your activity, uploads, and approvals from a clean dashboard with helpful visual insights.',
  },
];
const Services = () => {
  

  return (
    <section className="relative py-20">
      {/* section blur glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* header */}
        <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Why Choose <span className="text-indigo-400">ClassVault</span>
          </h2>
          <p className="text-gray-400 mt-4">
            A modern academic platform designed to simplify note sharing,
            collaboration, and study management.
          </p>
        </div>

        {/* features grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];

            return (
              <div
                key={feature.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-500/10 mb-4 group-hover:bg-indigo-500/20 transition">
                  <Icon className="text-2xl text-indigo-400" />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
