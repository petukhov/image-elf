const downloadImage = (fileName: string, dataUrl?: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', dataUrl || '');
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

export default downloadImage;
