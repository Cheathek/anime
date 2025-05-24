import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 dark:bg-gray-900">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>AnimePulse © {new Date().getFullYear()}. All rights reserved.</p>
            <p className="mt-1">
              Powered by <a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">Jikan API</a>.
              This is not affiliated with MyAnimeList.
            </p>
          </div>
          
          <div className="flex gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-primary-400"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;