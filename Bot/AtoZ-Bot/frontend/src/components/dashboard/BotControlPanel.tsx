import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Clock, Play, Power, Settings, Square } from 'lucide-react';
import React, { useState } from 'react';
import { useBotStore } from '../../stores/botStore';
import Button from '../ui/Button';
import Card from '../ui/Card';

const BotControlPanel: React.FC = () => {
  const { botStatus, startBot, stopBot, refreshStatus } = useBotStore();
  const [sessionName, setSessionName] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await startBot(sessionName || undefined);
      setSessionName('');
    } catch (error) {
      console.error('Failed to start bot:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStop = async () => {
    setIsStopping(true);
    try {
      await stopBot();
    } catch (error) {
      console.error('Failed to stop bot:', error);
    } finally {
      setIsStopping(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-success-600 bg-success-100 dark:bg-success-900/30';
      case 'stopped':
        return 'text-secondary-600 bg-secondary-100 dark:bg-secondary-800';
      case 'error':
        return 'text-error-600 bg-error-100 dark:bg-error-900/30';
      default:
        return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
    }
  };

  const getLoginStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success-600 bg-success-100 dark:bg-success-900/30';
      case 'failed':
        return 'text-error-600 bg-error-100 dark:bg-error-900/30';
      default:
        return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Bot Control
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshStatus}
        >
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Status Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Power className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
              Bot Status
            </span>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(botStatus?.status || 'stopped')}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              botStatus?.status === 'running' ? 'bg-success-500 animate-pulse' : 'bg-secondary-400'
            }`} />
            {botStatus?.status || 'Stopped'}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
              Login Status
            </span>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLoginStatusColor(botStatus?.login_status || 'not_started')}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              botStatus?.login_status === 'success' ? 'bg-success-500' : 'bg-secondary-400'
            }`} />
            {botStatus?.login_status || 'Not Started'}
          </div>
        </div>
      </div>

      {/* Session Info */}
      {botStatus?.is_running && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800"
        >
          <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
            Current Session
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-primary-700 dark:text-primary-300">Session:</span>
              <p className="font-medium text-primary-900 dark:text-primary-100">
                {botStatus.session_name || 'Unnamed'}
              </p>
            </div>
            <div>
              <span className="text-primary-700 dark:text-primary-300">Checks:</span>
              <p className="font-medium text-primary-900 dark:text-primary-100">
                {botStatus.total_checks.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-primary-700 dark:text-primary-300">Accepted:</span>
              <p className="font-medium text-success-600">
                {botStatus.total_accepted.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-primary-700 dark:text-primary-300">Rejected:</span>
              <p className="font-medium text-error-600">
                {botStatus.total_rejected.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {!botStatus?.is_running ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Session Name (Optional)
                </label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Enter session name..."
                  className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <Button
                onClick={handleStart}
                loading={isStarting}
                disabled={isStarting}
                className="w-full"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Bot
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="stop"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Button
                onClick={handleStop}
                loading={isStopping}
                disabled={isStopping}
                variant="error"
                className="w-full"
                size="lg"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop Bot
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex space-x-3">
          <Button
            variant="secondary"
            className="flex-1"
            size="md"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="flex-1"
            size="md"
            onClick={refreshStatus}
          >
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BotControlPanel;
