import axios from 'axios';

import type { ProfileMetadata } from '@/@types/cyberConnect';

class IpfsService {
  static async pinJSONToIPFS(json: ProfileMetadata) {
    const data = JSON.stringify(json);
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    return axios
      .post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: '63c3e8a5e10e22b78238',
          pinata_secret_api_key:
            '07c23a7b681a696a9447ce2ea2ecddb4870b1013dcafc6d41a99c459a48d2af4',
        },
      })
      .then((response) => response.data.IpfsHash)
      .catch((error) => {
        throw error;
      });
  }
}

const IpfsInstance = new IpfsService();
export { IpfsInstance, IpfsService };
