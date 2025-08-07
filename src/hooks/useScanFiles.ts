import {useCallback} from "react";
import {useScanContext} from "../context/ScanContext";
import {Config} from "../types/config";
import {ISFResponse, ISFFResponse, ScanError} from "../types/scanFiles"

export const useScanFiles = (
    setLoading: (value: boolean) => void,
    scrollToPage: (page: number) => void
) => {
    const {files, setFiles, activePage, setActivePage} = useScanContext();

    const scan = (config: Config) => {
        if (!window.IsidaImageScanning) {
            console.warn('IsidaImageScanning is not available');
            return;
        }
        try {
            setTimeout(() => {
                if (files.length === 0){
                    console.error('Возникла ошибка при сканировании документа');
                }
                setLoading(false);
            }, 60000);

            const conf = {
                ...config,
                format: {
                    quality: 50,
                    type: 'jpeg'
                }
            };

            setLoading(true);
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

                            result.pages.forEach((page, i, pages) => {
                                let number;
                                if (files && files.length > 0 && pages[i].number === (files[i] && files[i].number)){
                                    number = files.length+1;
                                } else {
                                    number = page.number;
                                }
                                setFiles(prev => [
                                    ...prev,
                                    {
                                        number: number,
                                        type: page.type,
                                        content: page.content
                                    }
                                ]);
                                setLoading(false);
                                console.log(`files: ${files}`);
                            })
                        })
                        .catch((error: ScanError) => {
                            setLoading(false);
                            console.error(`Ошибка сканирования (getImageScanningFiles): ${error.status}`);
                        })

                })
                .catch((error: ScanError) => {
                    setLoading(false);
                    console.error(`Ошибка сканирования (getImageScanningFiles): ${error.status}, description: ${error.status.description}`)
                })

        } catch (e : any){
            setLoading(false);
            console.error(`(getImageScanningFiles): ${e.status}`)
        }
    }

    const handleDeletePage = useCallback(() => {
        if (activePage < 1 || activePage > files.length) {
            console.warn("Cannot delete: activePage is out of bounds.");
            return;
        }

        let newArr = files.filter((_, i) => {
            return i !== activePage - 1
        });
        newArr.forEach((file, i) => {
            file.number = i + 1;
        });
        setFiles(newArr);

        if (newArr.length === 0) {
            setActivePage(1);
        } else if (activePage > newArr.length) {
            scrollToPage(newArr.length);
        } else {
            scrollToPage(activePage);
        }
    }, [activePage, files, scrollToPage]);

    return {
        scan,
        handleDeletePage
    }
}