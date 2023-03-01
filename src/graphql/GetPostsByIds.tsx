import { gql } from "@apollo/client";

export const GET_POSTS_BY_IDS = gql`
query getPost($id: String!) {
      post(id: $id){
        id
        author
        title
        body
        createdAt
        updatedAt
        arweaveTxHash
      }
    }
    
`;