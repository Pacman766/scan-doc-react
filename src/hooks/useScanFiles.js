import {useCallback} from "react";
import {useScanContext} from "../context/ScanContext";

export const useScanFiles = (setLoading, scrollToPage) => {
    const {files, setFiles, activePage, setActivePage} = useScanContext();

    const scan = (config) => {
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
            window.IsidaImageScanning.getImageScanningFiles({
                scannerId: config.scannerId || 1,
                workingDirectory : "c:\\tmp",
                settings : conf,
            })
                .then(result => {
                    console.log("Scan result: " + result.status.result);

                    window.IsidaImageScanning.getImageScanningFromFiles({
                        files : result.files
                    })
                        .then(result => {
                            console.log(`pages result: ${result.status.result}`);

                            result.pages.forEach((page, i, pages) => {
                                let number;
                                if (files && files.length > 0 && pages.number === (files[i] && files[i].number)){
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
                        .catch(error => {
                            setLoading(false);
                            console.error(`Ошибка сканирования (getImageScanningFiles): ${error.status}`);
                        })

                })
                .catch(error => {
                    setLoading(false);
                    console.error(`Ошибка сканирования (getImageScanningFiles): ${error.status}, description: ${error.status.description}`)
                })

        } catch (e){
            setLoading(false);
            console.error(`Ошибка сканирования (getImageScanningFiles): ${e.status}`)
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