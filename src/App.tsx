import React from 'react';
import { GitHubProvider } from './context/GitHubContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import RepoManager from './components/RepoManager';

function App() {
  return (
    <ThemeProvider>
      <GitHubProvider>
        <Layout>
          <RepoManager />
          <div className="platform-info">
            <h2>Available Platforms</h2>
            <p>This application is available for Android and web platforms.</p>
            <a href="/path/to/your/app.apk" download>Download APK for Android</a>
          </div>
        </Layout>
      </GitHubProvider>
    </ThemeProvider>
  );
}

export default App;