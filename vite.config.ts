import * as Vite from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

const config: Vite.UserConfig = {
  plugins: [reactRefresh()],
};

export default config;
