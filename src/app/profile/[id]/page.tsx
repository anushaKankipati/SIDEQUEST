import { formatDate } from "@/libs/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/utils/authOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faLink, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faYoutube, faInstagram } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import Image from "next/image";
import MessageButton from "../../../components/MessageButton";

import { getUserById } from "./actions";          // ← pulled in from actions.ts

export default async function ProfilePage(
  {
    params,
  }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string>>;
  }
) {
  // unwrap the promise-wrapped params
  const { id } = await params;

  // validate the ID
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return <div className="p-8">User not found</div>;
  }

  const user = await getUserById(id);
  if (!user) {
    return <div className="p-8">User not found</div>;
  }

  const session = await getServerSession(authOptions);
  const isCurrentUser = session?.user?.email === user.email;

  return (
    <div className="flex flex-col md:flex-row absolute inset-0 top-16">
      <div className="w-full md:w-2/3 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="relative">
            <div className="flex items-start space-x-6">
              {/* Profile Image */}
              <div className="w-36 h-36 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden relative">
                {user.image ? (
                  <Image
                    src={user.image || "/placeholder.svg"}
                    alt={`${user.name}'s profile picture`}
                    width={144}
                    height={144}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              {/* Name, Email, CreatedAt */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">
                  {user.name}
                </h1>
                <p className="text-gray-500 text-s mt-4 mb-3">
                  Joined: {formatDate(user.createdAt)}
                </p>
                {user.socials && user.socials.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-2 mb-2">
                    {user.socials.map((social: string, index: number) => {
                      if (!social) return null;
                      
                      try {
                        const url = new URL(social);
                        let icon = null;
                        let label = url.hostname;
    
                        if (url.hostname.includes('github.com')) {
                          icon = <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />;
                          label = 'GitHub';
                        } else if (url.hostname.includes('linkedin.com')) {
                          icon = <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />;
                          label = 'LinkedIn';
                        } else if (url.hostname.includes('youtube.com')) {
                          icon = <FontAwesomeIcon icon={faYoutube} className="w-5 h-5" />;
                          label = 'YouTube';
                        } else if (url.hostname.includes('instagram.com')) {
                          icon = <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />;
                          label = 'Instagram';
                        } else {
                          icon = <FontAwesomeIcon icon={faLink} className="w-5 h-5" />;
                          label = url.hostname.replace('www.', '');
                        }
    
                        return (
                          <a
                            key={index}
                            href={social}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-theme-green hover:text-emerald-600 transition-colors"
                            title={social}
                          >
                            {icon}
                            <span className="text-sm">{label}</span>
                          </a>
                        );
                      } catch (error) {
                        console.warn(`Invalid URL skipped in socials: ${social}`, error);
                        return null;
                      }
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Edit Profile Button - Only show for current user */}
            {isCurrentUser ? (
              <Link
                href="/edit-profile"
                className="xs:inline-flex xs:absolute top-0 right-0 mt-4 rounded-full hover:bg-light-hover-green text-theme-green w-11 h-11 items-center justify-center"
              >
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-x-2 hover:bg-green-100 p-2 rounded-full">
                    <FontAwesomeIcon icon={faPencil} className="w-6 h-6" />
                    <p className="text-xl text-theme-green xs:hidden">Edit Profile</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="absolute top-0 right-0 mt-4">
                <MessageButton userId={user.id} />
              </div>
            )}
          </div>

          {/* Details Sections */}
          <div className="mt-8 space-y-6">
            {user.about && (
              <div className="p-6 bg-gray-100 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-800">About</h3>
                <p className="mt-1 text-gray-700">{user.about}</p>
              </div>
            )}

            {user.skills && user.skills.length > 0 && (
              <div className="p-6 bg-gray-100 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                <div className="flex flex-wrap mt-2">
                  {user.skills.map((skill: string, index: number) => (
                    <span key={index} className="text-sm tag mr-1 mt-1 mb-1">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.certifications && user.certifications.length > 0 && (
              <div className="p-6 bg-gray-100 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Certifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.certifications.map((cert: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-gray-900 mb-2">{cert.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">Issued by: {cert.issuer}</p>
                      <div className="text-sm text-gray-600 mb-3">
                        <p>Issued: {new Date(cert.issuedDate).toLocaleDateString()}</p>
                        <p>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</p>
                      </div>
                      {(cert.documentUrl || cert.documentFile) && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faFileAlt} className="text-gray-400 text-xl" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {cert.documentFile ? (cert.documentFile as any).name : 'External Document'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {cert.documentFile ? `${((cert.documentFile as any).size / 1024 / 1024).toFixed(2)} MB` : 'External Link'}
                              </p>
                            </div>
                            <a
                              href={cert.documentUrl || (cert.documentFile as any)?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-theme-green hover:text-emerald-600 transition-colors"
                            >
                              <span className="text-sm">View</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Quests Section */}
      <div className="w-full md:w-1/3 p-8 bg-gray-50 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Recent Quests Posted</h2>
        {user.Quest && user.Quest.length > 0 ? (
          <div className="space-y-0">
            {user.Quest.map((quest: any) => (
              <Link href={`/ad/${quest.id}`} key={quest.id}>
                <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow mb-4">
                  <h3 className="font-semibold text-theme-green">
                    {quest.title}
                  </h3>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>
                      {quest.category === "hourly"
                        ? `$${quest.price}/hr`
                        : `$${quest.price} (fixed)`}
                    </span>
                    <span>
                      {new Date(quest.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No quests posted yet.</p>
        )}
      </div>
    </div>
  );
}