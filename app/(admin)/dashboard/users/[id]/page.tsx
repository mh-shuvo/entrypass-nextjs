import {Metadata} from "next";
import {pageTitle} from "@/lib/metadata";
import {UserService} from "@/services/user.service";
import {UserRepository} from "@/repository/user.repository";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = pageTitle("View User");
const userService = new UserService(new UserRepository());
export default async function ViewUserPage({params}: {params: Promise<{id: string}>}) {
  const {id: rawId} = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id)) {
    return <div>User not found</div>;
  }

  const user = await userService.getUserById(id);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <>
    <div className="box-border border border-slate-300 rounded-s-base bg-neutral-secondary-low w-full rounded pb-5">
        <div className="flex items-start p-5">
            <div className="w-32"> 
                <Image
                src="/usericon.png"
                alt="User"
                width={100}
                height={100}
                className="rounded-full"
                loading="eager"
                />
            </div>
            <div className="ml-4">
                <h1 className="text-3xl font-bold pt-4">{user.name}</h1>
                <div className="badges flex space-x-2 justify-content pt-3">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        {user.UserType}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${user.status === "ACTIVE" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {user.status}
                    </span>
                </div>
            </div>
            <div className="ml-auto text-right">
                <button type="button" className="border border-slate-300 px-4 py-2 rounded-md hover:bg-gray-200">
                    <span className="inline-flex items-center text-[15px]">
                        <FontAwesomeIcon icon={faPencilAlt} width={13} className="mr-2" /> Edit  
                    </span>
                </button>
            </div>
        </div>  
        <div className="flex justify-content px-3 pt-3">
            <div className="box">
                <p className="text-gray-600 pt-2 text-sm text-muted-foreground">
                    Full Name
                </p>
                <p className="font-semibold">{user.name}</p>
            </div>
        </div>

        <div className="flex justify-content px-3 pt-3 space-x-30">
            <div className="box">
                <p className="text-gray-600 pt-2 text-sm text-muted-foreground">
                    Email Address
                </p>
                <p className="font-semibold">{user.email}</p>
            </div>

            <div className="box">
                <p className="text-gray-600 pt-2 text-sm text-muted-foreground">
                    Phone Number
                </p>
                <p className="font-semibold">+1 123-456-7890</p>
            </div>

            <div className="box">
                <p className="text-gray-600 pt-2 text-sm text-muted-foreground">
                    Bio
                </p>
                <p className="font-semibold">{user.UserType}</p>
            </div>

            <div className="box">
                <p className="text-gray-600 pt-2 text-sm text-muted-foreground">
                    Social Links
                </p>
                <div className="flex items-center gap-3 font-semibold">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-500 hover:underline">
                        <FontAwesomeIcon icon={faTwitter} className="size-3" />
                        Twitter
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-500 hover:underline">
                        <FontAwesomeIcon icon={faGithub} className="size-3" />
                        GitHub
                    </a>
                </div>
            </div>

        </div>
        </div>
        </>
  );
}