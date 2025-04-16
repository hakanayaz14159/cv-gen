import { CVInformations, CVGeneratorConfig } from "../../lib/types";

// Storage keys
const CV_DATA_KEY = 'cv-gen-user-data';
const CONFIG_KEY = 'cv-gen-config';

/**
 * Saves the user's CV data to localStorage
 *
 * @param data - The CV data to save
 * @returns boolean indicating success
 */
export const saveUserData = (data: Partial<CVInformations>): boolean => {
  try {
    // Prevent saving empty data
    if (!data || Object.keys(data).length === 0) {
      console.error('Attempted to save empty CV data to localStorage');
      return false;
    }

    // Make a deep copy of the data to avoid reference issues
    const dataCopy = JSON.parse(JSON.stringify(data));

    // Process the data to ensure it can be properly serialized
    // Convert Date objects to ISO strings
    if (dataCopy.experiences) {
      dataCopy.experiences.forEach((exp: any) => {
        if (exp.positions) {
          exp.positions.forEach((pos: any) => {
            if (pos.fromDate && pos.fromDate instanceof Date) {
              pos.fromDate = pos.fromDate.toISOString();
            }
            if (pos.toDate && pos.toDate instanceof Date) {
              pos.toDate = pos.toDate.toISOString();
            }
          });
        }
      });
    }

    if (dataCopy.projects) {
      dataCopy.projects.forEach((project: any) => {
        if (project.positions) {
          project.positions.forEach((pos: any) => {
            if (pos.fromDate && pos.fromDate instanceof Date) {
              pos.fromDate = pos.fromDate.toISOString();
            }
            if (pos.toDate && pos.toDate instanceof Date) {
              pos.toDate = pos.toDate.toISOString();
            }
          });
        }
      });
    }

    if (dataCopy.educations) {
      dataCopy.educations.forEach((edu: any) => {
        if (edu.entranceYear && edu.entranceYear instanceof Date) {
          edu.entranceYear = edu.entranceYear.toISOString();
        }
        if (edu.completionYear && edu.completionYear instanceof Date) {
          edu.completionYear = edu.completionYear.toISOString();
        }
      });
    }

    if (dataCopy.certificates) {
      dataCopy.certificates.forEach((cert: any) => {
        if (cert.acquiredWhen && cert.acquiredWhen instanceof Date) {
          cert.acquiredWhen = cert.acquiredWhen.toISOString();
        }
        if (cert.endsWhen && cert.endsWhen instanceof Date) {
          cert.endsWhen = cert.endsWhen.toISOString();
        }
      });
    }

    // If there are skills in the data, make sure they're properly processed
    if (dataCopy.skills && Array.isArray(dataCopy.skills)) {
      // Group skills by their group property
      const skillsByGroup: Record<string, any[]> = {};

      dataCopy.skills.forEach((skill: any) => {
        if (skill.group) {
          if (!skillsByGroup[skill.group]) {
            skillsByGroup[skill.group] = [];
          }

          // Create a clean skill object without the group property
          const { group, ...cleanSkill } = skill;
          skillsByGroup[skill.group].push(cleanSkill);
        }
      });

      // Set the skillDetails property
      if (Object.keys(skillsByGroup).length > 0) {
        dataCopy.skillDetails = skillsByGroup;
      }
    }

    const serializedData = JSON.stringify(dataCopy);

    localStorage.setItem(CV_DATA_KEY, serializedData);

    return true;
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
    return false;
  }
};

/**
 * Loads the user's CV data from localStorage
 *
 * @returns The saved CV data or null if none exists
 */
export const loadUserData = (): Partial<CVInformations> | null => {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.error('localStorage is not available');
      return null;
    }

    const serializedData = localStorage.getItem(CV_DATA_KEY);

    if (!serializedData) return null;

    // Parse the data and convert date strings back to Date objects
    const data = JSON.parse(serializedData);

    // Process experiences
    if (data.experiences) {
      data.experiences.forEach((exp: any) => {
        if (exp.positions) {
          exp.positions.forEach((pos: any) => {
            try {
              if (pos.fromDate) pos.fromDate = new Date(pos.fromDate);
              if (pos.toDate) pos.toDate = new Date(pos.toDate);
            } catch (e) {
              console.error('Error converting date in experience:', e);
            }
          });
        }
      });
    }

    // Process projects
    if (data.projects) {
      data.projects.forEach((project: any) => {
        if (project.positions) {
          project.positions.forEach((pos: any) => {
            try {
              if (pos.fromDate) pos.fromDate = new Date(pos.fromDate);
              if (pos.toDate) pos.toDate = new Date(pos.toDate);
            } catch (e) {
              console.error('Error converting date in project:', e);
            }
          });
        }
      });
    }

    // Process educations
    if (data.educations) {
      data.educations.forEach((edu: any) => {
        try {
          if (edu.entranceYear) edu.entranceYear = new Date(edu.entranceYear);
          if (edu.completionYear) edu.completionYear = new Date(edu.completionYear);
        } catch (e) {
          console.error('Error converting date in education:', e);
        }
      });
    }

    // Process certificates
    if (data.certificates) {
      data.certificates.forEach((cert: any) => {
        try {
          if (cert.acquiredWhen) cert.acquiredWhen = new Date(cert.acquiredWhen);
          if (cert.endsWhen) cert.endsWhen = new Date(cert.endsWhen);
        } catch (e) {
          console.error('Error converting date in certificate:', e);
        }
      });
    }

    return data;
  } catch (error) {
    console.error('Error loading user data from localStorage:', error);
    return null;
  }
};

/**
 * Saves the user's configuration to localStorage
 *
 * @param config - The configuration to save
 * @returns boolean indicating success
 */
export const saveConfig = (config: CVGeneratorConfig): boolean => {
  try {
    // Prevent saving empty config
    if (!config || Object.keys(config).length === 0) {
      console.error('Attempted to save empty config to localStorage');
      return false;
    }

    // Make a deep copy of the config to avoid reference issues
    const configCopy = JSON.parse(JSON.stringify(config));

    const serializedConfig = JSON.stringify(configCopy);

    localStorage.setItem(CONFIG_KEY, serializedConfig);

    return true;
  } catch (error) {
    console.error('Error saving configuration to localStorage:', error);
    return false;
  }
};

/**
 * Loads the user's configuration from localStorage
 *
 * @returns The saved configuration or null if none exists
 */
export const loadConfig = (): CVGeneratorConfig | null => {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.error('localStorage is not available');
      return null;
    }

    const serializedConfig = localStorage.getItem(CONFIG_KEY);

    if (!serializedConfig) return null;

    const config = JSON.parse(serializedConfig);

    return config;
  } catch (error) {
    console.error('Error loading configuration from localStorage:', error);
    return null;
  }
};

/**
 * Clears all saved data from localStorage
 *
 * @returns boolean indicating success
 */
export const clearAllData = (): boolean => {
  try {
    localStorage.removeItem(CV_DATA_KEY);
    localStorage.removeItem(CONFIG_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing data from localStorage:', error);
    return false;
  }
};

/**
 * Exports all user data and configuration as a JSON file for backup
 */
export const exportData = (): void => {
  try {
    const userData = localStorage.getItem(CV_DATA_KEY);
    const config = localStorage.getItem(CONFIG_KEY);

    const exportData = {
      userData: userData ? JSON.parse(userData) : null,
      config: config ? JSON.parse(config) : null,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileName = `cv-gen-backup-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};

/**
 * Imports user data and configuration from a JSON file
 *
 * @param jsonData - The JSON data to import
 * @returns boolean indicating success
 */
export const importData = (jsonData: string): boolean => {
  try {

    const data = JSON.parse(jsonData);

    if (data.userData) {
      // Process the userData to ensure dates are properly formatted
      const processedData = { ...data.userData };

      // Process experiences
      if (processedData.experiences) {
        processedData.experiences.forEach((exp: any) => {
          if (exp.positions) {
            exp.positions.forEach((pos: any) => {
              if (pos.fromDate) pos.fromDate = new Date(pos.fromDate).toISOString();
              if (pos.toDate) pos.toDate = new Date(pos.toDate).toISOString();
            });
          }
        });
      }

      // Process projects
      if (processedData.projects) {
        processedData.projects.forEach((project: any) => {
          if (project.positions) {
            project.positions.forEach((pos: any) => {
              if (pos.fromDate) pos.fromDate = new Date(pos.fromDate).toISOString();
              if (pos.toDate) pos.toDate = new Date(pos.toDate).toISOString();
            });
          }
        });
      }

      // Process educations
      if (processedData.educations) {
        processedData.educations.forEach((edu: any) => {
          if (edu.entranceYear) edu.entranceYear = new Date(edu.entranceYear).toISOString();
          if (edu.completionYear) edu.completionYear = new Date(edu.completionYear).toISOString();
        });
      }

      // Process certificates
      if (processedData.certificates) {
        processedData.certificates.forEach((cert: any) => {
          if (cert.acquiredWhen) cert.acquiredWhen = new Date(cert.acquiredWhen).toISOString();
          if (cert.endsWhen) cert.endsWhen = new Date(cert.endsWhen).toISOString();
        });
      }

      // Save the processed data
      localStorage.setItem(CV_DATA_KEY, JSON.stringify(processedData));
    } else {
      // No user data found
    }

    if (data.config) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(data.config));
    } else {
      // No config found
    }

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
