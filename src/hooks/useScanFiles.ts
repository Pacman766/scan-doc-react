import {useCallback} from "react";
import {useScanContext} from "../context/ScanContext";
import {Config} from "../types/config";
import {ISFResponse, ISFFResponse, ScanError, Page} from "../types/scanFiles"
import {store, useAppSelector} from "../store";
import {deletePage, setAllFiles, setFilesError, setFilesLoading} from "../store/slices/filesSlice";

export const useScanFiles = (
    scrollToPage: (page: number) => void
) => {
    const {activePage, setActivePage} = useScanContext();
    const files = useAppSelector(state => state.files.pages);
    const scan = (config: Config) => {
        if (!window.IsidaImageScanning) {
            console.warn('IsidaImageScanning is not available');
            return;
        }
        try {
            setTimeout(() => {
                if (files?.length === 0){
                    console.error('Возникла ошибка при сканировании документа');
                }
                store.dispatch(setFilesLoading(false));
            }, 60000);

            const conf = {
                ...config,
                format: {
                    quality: 50,
                    type: 'jpeg'
                }
            };

            store.dispatch(setFilesLoading(true));
            window.IsidaImageScanning?.getImageScanningFiles({
                scannerId: config.scannerId || 1,
                workingDirectory : "c:\\tmp",
                settings : conf,
            })
                .then((result: ISFResponse)=> {
                    console.log("Scan result: " + result.status.result);
                    window.IsidaImageScanning?.getImageScanningFromFiles({
                        files : result.files
                    })
                        .then((result: ISFFResponse) => {
                            console.log(`pages result: ${result.status.result}`);

                            const newPages: Page[] = result.pages.map((page, i, pages) => {
                                let number;
                                if (files && files.length > 0 && pages[i].number === (files[i] && files[i].number)){
                                    number = files.length+1;
                                } else {
                                    number = page.number;
                                }

                                return {
                                    number,
                                    type: page.type,
                                    content: page.content
                                }
                            });

                            store.dispatch(setAllFiles([...(files || []), ...newPages]));
                            store.dispatch(setFilesLoading(false));
                            console.log(`files: ${files}`);
                        })
                        .catch((error: ScanError) => {
                            store.dispatch(setFilesLoading(false));
                            store.dispatch(setFilesError(error.status?.result));
                            console.error(`Ошибка сканирования (getImageScanningFiles): ${error.status}`);
                        })

                })
                .catch((error: ScanError) => {
                    store.dispatch(setFilesLoading(false));
                    store.dispatch(setFilesError(error.status?.result));
                    console.error(`Ошибка сканирования (getImageScanningFiles): ${error.status}, description: ${error.status.description}`)
                })

        } catch (e : any){
            store.dispatch(setFilesLoading(false));
            console.error(`(getImageScanningFiles): ${e.status}`)
        }
    }

    const handleDeletePage = useCallback(() => {
        if (!files || files.length === 0) return;
        if (activePage < 1 || activePage > files.length) {
            console.warn("Cannot delete: activePage is out of bounds.");
            return;
        }

        store.dispatch(deletePage(activePage));
        const newLength = files.length-1;

        if (newLength === 0) {
            setActivePage(1);
        } else if (activePage > newLength) {
            scrollToPage(newLength);
        } else {
            scrollToPage(activePage);
        }
    }, [activePage, files, scrollToPage]);

    return {
        scan,
        handleDeletePage
    }
}