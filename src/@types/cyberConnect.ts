import { Status } from "@/enums/CyberStatus";

export type Attribute = {
  display_type: string;
  trait_type: string;
  value: string;
};

export type ProfileMetadata = {
  display_name: string;
  bio: string;
  avatar: string;
  cover_image: string;
  attributes: Attribute[];
  version: string; // Current version: 1.1.0
};

export type Profile = {
  handle: string;
  id: string;
  profileID: number;
  avatar: string;
  isPrimary: boolean;
  metadata: string;
  metadataInfo: ProfileMetadata;
};


export interface IProfileCard {
	handle: string;
	avatar: string;
	metadata: string;
	profileID: number;
	isSubscribedByMe: boolean;
}

export type Post = {
	title: string;
	body: string;
};

export type PublishResponse = {
	status: Status;
	id: string;
	arweaveTxHash: string;
};