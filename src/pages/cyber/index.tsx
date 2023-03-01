import { Avatar, Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAccount, useConnect, useContractWrite, useDisconnect, usePrepareContractWrite, useProvider, useSigner } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import ProfileNFT from '@/abis/ProfileNFT.json';
import RenderIf from '@/components/RenderIf';
import { PROFILE_NFT_CONTRACT, PROFILE_NFT_OPERATOR } from '@/utils/constants';
import { useQuery } from "@apollo/client";
import { PROFILES_BY_IDS } from "@/graphql/ProfilesByIds";
import { IProfileCard, Post } from '@/@types/cyberConnect';
import { GET_POSTS_BY_IDS } from '@/graphql/GetPostsByIds';
import CyberConnect, {
  Env
} from '@cyberlab/cyberconnect-v2';

const Cyber = () => {
  const provider = useProvider({ chainId: 97})
  const { data: signer } = useSigner({
    chainId: 97
  })
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const {  data: profilesData, loading }= useQuery(PROFILES_BY_IDS, { 
				variables: {
					profileIDs: [517],
					myAddress: address,
				},
  });
  const { data: postsData, loading: postLoading } = useQuery(GET_POSTS_BY_IDS, {
    variables: {
      id: "6b5d660c7fee486ca3a343abd7d56ebe27f41d76e1ff4babbde86106ea1f8117"
    }
  })

  console.log("Posts Data", postsData)
  const { config, refetch } = usePrepareContractWrite({
    address: PROFILE_NFT_CONTRACT,
  abi: ProfileNFT,
  functionName: "createProfile",
  args: [
    {
      to: address,
      handle: `evmos_et`, // Handle name has to be unique on a specific blockchain, that mean only one person can create profile with handle
      metadata: "",
      avatar: "",
      operator: PROFILE_NFT_OPERATOR, // Operator has to be different from to address if operator != address(0)
    },
    "0x",
    "0x",
  ],
    enabled: false,
  });
  const { write } = useContractWrite(config);
  const [profiles, setProfiles] = useState<IProfileCard[]>([]);
  const [post, setPost] = useState<Post>({
    title: "",
    body: ""
  })



  const handleCreateProfile = async () => {
    await refetch();
    write?.()
  }

  const handleCreatePost = async () => {
    
    if (signer?.provider != undefined) {
      console.log(signer?.provider)
      const cyberConnect = new CyberConnect({
        namespace: 'Padisea',
        env: Env.STAGING,
        provider: signer?.provider,
        signingMessageEntity: 'CyberConnect',
      });
      await cyberConnect.createPost(post, "evmos_eth");
      // AFter creating a post, we have to add posts to database with the id
    }
  }

  const handleFollow = async ()=> {
    if (signer?.provider != undefined && address != undefined) {
      console.log(signer?.provider)
      const cyberConnect = new CyberConnect({
        namespace: 'Padisea',
        env: Env.STAGING,
        provider: signer?.provider,
        signingMessageEntity: 'CyberConnect',
      });
      await cyberConnect.follow(address, "evmos_et.cc")
    }
  }


  useEffect(() => {
    (async () => {
    })
    if (loading == false) {
      setProfiles(profilesData?.profilesByIDs || [])
    }
  }, [loading])

  return (
    <div>
      <RenderIf isTrue={!isConnected}>
        <Button
          onClick={() => {
            connect();
          }}
        >
          Connect
        </Button>
      </RenderIf>
      <RenderIf isTrue={isConnected}>
        <p>{address?.toString()}</p>
        <Button
          onClick={() => {
            disconnect();
          }}
        >
          Disconnect
        </Button>

        <Button onClick={handleCreateProfile}>Create Profile</Button>
        
        <RenderIf isTrue={loading == false && profiles != undefined}>
          {
            profiles.map((item: IProfileCard, key: number) => {
              console.log(item)
              return (
                <div key={key}>
                  <Avatar src={item.avatar}/>
                  <p>Handle: {item.handle}</p>
                </div>
              )
            })
          }
        </RenderIf>
        <h2 className="font-bold">Your Posts: </h2>
        <Input placeholder='Input title' onChange={(e) => {
          setPost({...post, title: e.target.value})
        }}/>
        <Input placeholder='Input body' onChange={(e) => {
          setPost({...post, body: e.target.value})
        }}/>
        <Button onClick={() => handleCreatePost()}>Create a Post</Button>
        <Button onClick={() => handleFollow()}>Follow "evmos_eth" Handle</Button>

        <p>Post by Id: 6b5d660c7fee486ca3a343abd7d56ebe27f41d76e1ff4babbde86106ea1f8117</p>
        <p>Title: {postsData?.post?.title}</p>
        <p>Body: {postsData?.post?.body}</p>
      </RenderIf>

    </div>
  );
};

export default Cyber;
