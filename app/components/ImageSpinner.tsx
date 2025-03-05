'use client';

import { useState, useRef, ChangeEvent } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './ImageSpinner.module.css';

export default function ImageSpinner() {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [rotationSpeed, setRotationSpeed] = useState<number>(1);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        x: 25,
        y: 25,
        width: 50,
        height: 50
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [isCropping, setIsCropping] = useState<boolean>(true);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setCroppedImageUrl(null);
            setIsCropping(true);
        }
    };

    const handleSpeedChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRotationSpeed(parseFloat(event.target.value));
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const getCroppedImg = (sourceImage: HTMLImageElement, crop: PixelCrop) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d context');
        }

        const scaleX = sourceImage.naturalWidth / sourceImage.width;
        const scaleY = sourceImage.naturalHeight / sourceImage.height;

        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
            sourceImage,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return canvas.toDataURL('image/jpeg');
    };

    const handleCropComplete = () => {
        if (completedCrop && imageRef.current) {
            const croppedImage = getCroppedImg(imageRef.current, completedCrop);
            setCroppedImageUrl(croppedImage);
            setIsCropping(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.uploadSection}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className={styles.fileInput}
                />
            </div>
            
            {imageUrl && isCropping && (
                <div className={styles.cropContainer}>
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={1}
                    >
                        <img
                            ref={imageRef}
                            src={imageUrl}
                            alt="Crop me"
                            className={styles.cropImage}
                        />
                    </ReactCrop>
                    <button
                        onClick={handleCropComplete}
                        className={styles.cropButton}
                    >
                        Crop Image
                    </button>
                </div>
            )}
            
            {croppedImageUrl && !isCropping && (
                <>
                    <div className={styles.imageContainer}>
                        <img
                            src={croppedImageUrl}
                            alt="Spinning image"
                            className={styles.spinningImage}
                            style={{
                                animationDuration: `${2/rotationSpeed}s`,
                                animationPlayState: isPlaying ? 'running' : 'paused'
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <button
                            onClick={togglePlayPause}
                            className={styles.playPauseButton}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <label htmlFor="speed">Rotation Speed:</label>
                        <input
                            type="range"
                            id="speed"
                            min="0.1"
                            max="20"
                            step="0.1"
                            value={rotationSpeed}
                            onChange={handleSpeedChange}
                            className={styles.slider}
                        />
                        <span>{rotationSpeed.toFixed(1)}x</span>
                    </div>
                </>
            )}
        </div>
    );
} 