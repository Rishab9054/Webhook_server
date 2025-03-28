const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/webhook', async (req, res) => {
  console.log('Received webhook:', req.body);
  const repoName = req.body.repository.repo_name; // e.g., "rishab9054/myapp"
  const tag = req.body.push_data.tag; // e.g., "latest"
  const imageRef = `${repoName}:${tag}`; // e.g., "rishab9054/myapp:latest"

  try {
    const response = await fetch('https://api.github.com/repos/Rishab9054/Image_Scanner/dispatches', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_PAT}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        event_type: 'docker-push',
        client_payload: {
          image_ref: imageRef
        }
      })
    });
    if (response.ok) {
      console.log(`Webhook forwarded to GitHub for ${imageRef}`);
      res.status(200).send('Webhook processed successfully');
    } else {
      console.error('Failed to forward:', response.status);
      res.status(500).send('Failed to forward webhook');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));