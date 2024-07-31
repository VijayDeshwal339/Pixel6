import axios from 'axios';

// Pan Api call and check pan number enter by user
export const verifyPAN = async (panNumber) => {
  const response = await axios.post('https://lab.pixel6.co/api/verify-pan.php', { panNumber });
  return response.data;
};

// postcode Api call and check postcode enter by user
export const getPostcodeDetails = async (postcode) => {
  const response = await axios.post('https://lab.pixel6.co/api/get-postcode-details.php', { postcode });
  return response.data;
};
