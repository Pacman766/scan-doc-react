import type {Scanner} from "./scanner";
import type {Config} from "./config";

export type SettingsDialogProps = {
    getScanners: () => Promise<Scanner[]>;
    config?: Config;
    saveConfig: (newConfig: Config)  => void
}