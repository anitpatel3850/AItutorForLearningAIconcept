import { Course } from './types';

export const computerVisionCourse: Course = {
  id: 'computer-vision',
  title: 'Computer Vision',
  shortDescription: 'From pixels to perception: master spatial filters, edge detectors, convolutional classifiers, YOLO object detectors, and segmentation networks.',
  description: 'Teach machines to see, analyze, and comprehend visual reality. Journey from pixel color spaces and classical image transformations (OpenCV) to state-of-the-art YOLO object detectors and semantic segmentation.',
  iconName: 'Eye',
  level: 'Intermediate',
  category: 'Specialized AI',
  estimatedHours: 22,
  badge: 'Visual Oracle',
  accentColor: 'pink',
  whatYouWillLearn: [
    'Manipulate multidimensional image channels, RGB, BGR, Grayscale, and HSV color spaces',
    'Apply classical filtering kernels: Gaussian blur, Sobel gradients, and Canny edge detection',
    'Extract morphological structures, contours, bounding boxes, and image moments with OpenCV',
    'Train deep vision CNNs with data augmentation (flips, crops, rotations, color jitter)',
    'Implement modern Object Detection architectures (YOLO, Faster R-CNN) with IoU & NMS',
    'Construct Semantic and Instance Segmentation models using U-Net and Mask R-CNN',
    'Deploy real-time webcam and video inference streams with optimized inference frames'
  ],
  prerequisites: [
    'Python programming & NumPy array operations',
    'Fundamental understanding of convolutional neural networks (CNNs)'
  ],
  skillsYouWillGain: [
    'OpenCV 4 & PIL Image Manipulation',
    'Canny Edges & Contour Extraction',
    'Transfer Learning (ResNet, EfficientNet)',
    'YOLOv8 Real-Time Object Detection',
    'U-Net Semantic Segmentation'
  ],
  completionRequirements: [
    'Complete all 7 modules and interactive lessons',
    'Pass all mini-quizzes',
    'Deliver the Computer Vision capstone detector'
  ],
  modules: [
    {
      id: 'cv-m1',
      moduleNumber: 1,
      title: 'Image Fundamentals & Color Spaces',
      description: 'Pixels, channel matrices, RGB vs BGR in OpenCV, grayscale conversion, and histogram equalization.',
      difficulty: 'Beginner',
      estimatedMinutes: 80,
      xpReward: 200,
      lessons: [
        {
          id: 'cv-l1-pixels',
          title: 'Pixels, Channels & Spatial Dimensions',
          description: 'Images as 3D NumPy arrays (Height, Width, Channels) and uint8 vs float32 ranges.',
          estimatedMinutes: 20,
          xpReward: 20,
          learningObjective: 'Inspect and transform image tensor shapes and convert between RGB and Grayscale.',
          explanation: 'A digital image is a numerical matrix. A color image of dimensions 1080x1920 has shape (1080, 1920, 3) where each channel represents Red, Green, and Blue intensity from 0 to 255.',
          importantConcepts: [
            'Shape Convention: Height (rows) x Width (columns) x Channels (depth).',
            'BGR vs RGB: OpenCV loads images in BGR format by default, while matplotlib expects RGB.',
            'Grayscale Conversion: Weighted sum: Y = 0.299*R + 0.587*G + 0.114*B matching human eye sensitivity.'
          ],
          keyPoints: [
            'Always verify whether image libraries follow (H, W, C) or PyTorch\'s (C, H, W).',
            'Floating-point images typically operate in [0.0, 1.0], while integer images use uint8 [0, 255].'
          ],
          codeExample: {
            language: 'python',
            code: `import numpy as np\n\n# Create a synthetic 100x100 RGB image\nsynthetic_img = np.zeros((100, 100, 3), dtype=np.uint8)\nsynthetic_img[:, :, 0] = 255 # Pure Red channel\n\nprint("Image Shape (H, W, C):", synthetic_img.shape)\nprint("Top-Left Pixel BGR:", synthetic_img[0, 0])`,
            explanation: 'Allocating and addressing an image tensor in NumPy.',
            output: 'Image Shape (H, W, C): (100, 100, 3)\nTop-Left Pixel BGR: [255   0   0]'
          },
          practicalExample: {
            title: 'OpenCV to Matplotlib Color Fix',
            scenario: 'An image loaded with cv2.imread() appears blueish in matplotlib. How to fix?',
            solution: 'rgb_img = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2RGB)'
          },
          quiz: {
            question: 'Why does human perception weighting allocate the largest factor (0.587) to the Green channel when computing grayscale?',
            options: [
              'Green photons travel faster',
              'The human eye contains more green-sensitive cone photoreceptors',
              'Computer monitors produce brighter green pixels',
              'Green pixels consume less storage'
            ],
            correctIndex: 1,
            explanation: 'Human photopic vision is tuned to peak sensitivity around 555nm (green light), necessitating higher weight.'
          },
          practiceChallenge: {
            prompt: 'Given an image tensor of shape (224, 224, 3), convert it to PyTorch convention (3, 224, 224) using np.transpose().',
            starterCode: 'img = np.zeros((224, 224, 3))\n# img_torch = ?',
            solutionHint: 'Use np.transpose(img, (2, 0, 1)).',
            solutionCode: 'img_torch = np.transpose(img, (2, 0, 1))\nprint(img_torch.shape) # (3, 224, 224)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'cv-m2',
      moduleNumber: 2,
      title: 'Image Processing & Spatial Filtering',
      description: 'Convolution kernels, Gaussian blur, bilateral filtering, Sobel gradients, and Canny edge detection.',
      difficulty: 'Intermediate',
      estimatedMinutes: 90,
      xpReward: 200,
      lessons: [
        {
          id: 'cv-l2-filters',
          title: 'Spatial Filtering & Edge Detection',
          description: 'Applying 2D kernels to detect boundaries, smooth sensor noise, and isolate high-frequency gradients.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Apply Gaussian smoothing followed by Canny edge detection with dual-threshold hysteresis.',
          explanation: 'Edges correspond to dramatic intensity changes in pixel values. Canny edge detection smooths noise, computes gradient magnitudes via Sobel, applies non-maximum suppression, and uses hysteresis thresholding.',
          importantConcepts: [
            'Kernel Convolution: Sliding a small weighted matrix over each pixel neighborhood.',
            'Gaussian Blur: Low-pass filter removing high-frequency camera sensor noise.',
            'Canny Hysteresis: Strong edges above high_thresh are kept; weak edges below low_thresh are discarded unless connected to strong ones.'
          ],
          keyPoints: [
            'Always blur an image before edge detection to avoid false edges from noise.',
            'Kernel dimensions should almost always be odd numbers (3x3, 5x5) so a clear center pixel exists.'
          ],
          codeExample: {
            language: 'python',
            code: `# Standard Canny Edge Detection Pipeline\n# blurred = cv2.GaussianBlur(gray, (5, 5), sigmaX=1.4)\n# edges = cv2.Canny(blurred, threshold1=50, threshold2=150)\nprint("Edges detected using dual hysteresis thresholds (50, 150).")`,
            explanation: 'The classic 2-step edge extraction pipeline.',
            output: 'Edges detected using dual hysteresis thresholds (50, 150).'
          },
          practicalExample: {
            title: 'License Plate Edge Isolation',
            scenario: 'Highlight rectangular borders of vehicle license plates for OCR parsing.',
            solution: 'cv2.Canny(cv2.GaussianBlur(gray_plate, (3, 3), 0), 100, 200)'
          },
          quiz: {
            question: 'What is the purpose of non-maximum suppression (NMS) in Canny edge detection?',
            options: [
              'To amplify contrast',
              'To thin wide edge responses down to 1-pixel wide sharp boundaries',
              'To eliminate negative color values',
              'To resize the image'
            ],
            correctIndex: 1,
            explanation: 'NMS suppresses non-peak gradient pixels along the gradient direction, producing crisp 1-pixel wide lines.'
          },
          practiceChallenge: {
            prompt: 'Write the 3x3 Sobel horizontal edge detection kernel in NumPy.',
            starterCode: 'import numpy as np\n# sobel_x = ?',
            solutionHint: 'Columns are [-1, 0, 1], [-2, 0, 2], [-1, 0, 1].',
            solutionCode: 'import numpy as np\nsobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])\nprint(sobel_x)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'cv-m3',
      moduleNumber: 3,
      title: 'Feature Extraction & Classical Descriptors',
      description: 'Harris corner detection, SIFT (Scale-Invariant Feature Transform), ORB, and image feature matching.',
      difficulty: 'Intermediate',
      estimatedMinutes: 90,
      xpReward: 200,
      lessons: [
        {
          id: 'cv-l3-descriptors',
          title: 'Keypoints & Invariant Descriptors',
          description: 'Detecting robust visual anchors resistant to scale, rotation, and illumination changes.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Extract keypoints with ORB and match descriptors between rotated image pairs.',
          explanation: 'Before deep learning, panoramic image stitching and 3D reconstruction relied on keypoint detectors that locate distinctive visual points (corners, blobs) and compute numerical fingerprints describing the neighborhood.',
          importantConcepts: [
            'Corner vs Edge: Corners change intensity in all directions, making them unique tracking points.',
            'Scale Invariance: Using Difference of Gaussians (DoG) octaves to detect keypoints regardless of camera zoom.',
            'ORB (Oriented FAST and Rotated BRIEF): Fast, patent-free alternative to SIFT/SURF.'
          ],
          keyPoints: [
            'ORB descriptors are binary bitstrings, allowing ultrafast Hamming distance matching.',
            'Use RANSAC to eliminate outlier matches when computing homography matrices.'
          ],
          codeExample: {
            language: 'python',
            code: `# orb = cv2.ORB_create(nfeatures=500)\n# keypoints, descriptors = orb.detectAndCompute(img, None)\n# matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)\n# matches = matcher.match(desc1, desc2)\nprint("Extracted 500 keypoint descriptors with invariant orientations.")`,
            explanation: 'Extracting and matching invariant local image descriptors.',
            output: 'Extracted 500 keypoint descriptors with invariant orientations.'
          },
          practicalExample: {
            title: 'Panorama Stitching',
            scenario: 'Align two overlapping drone images into a wide composite.',
            solution: 'Match ORB features, estimate Homography with RANSAC, and warp perspective.'
          },
          quiz: {
            question: 'Why is Hamming distance preferred over Euclidean distance for matching ORB descriptors?',
            options: [
              'Hamming distance handles color images better',
              'ORB outputs binary vectors where Hamming distance is computed via simple XOR bit operations',
              'Euclidean distance cannot operate in 2D space',
              'Hamming distance preserves rotation'
            ],
            correctIndex: 1,
            explanation: 'Binary descriptors compare bits using CPU/GPU POPCNT (population count of XOR), which is orders of magnitude faster than floating-point distance.'
          },
          practiceChallenge: {
            prompt: 'Calculate the Hamming distance between two binary bytes: 11010010 and 11000010.',
            starterCode: '# distance = ?',
            solutionHint: 'Count how many bits differ.',
            solutionCode: 'differing_bits = 1 # Only the 4th bit from the left differs\nprint(f"Hamming distance: {differing_bits}")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'cv-m4',
      moduleNumber: 4,
      title: 'Deep Vision: CNNs & Transfer Learning',
      description: 'Fine-tuning ImageNet backbones (ResNet, EfficientNet, MobileNet) with torchvision.',
      difficulty: 'Intermediate',
      estimatedMinutes: 120,
      xpReward: 250,
      lessons: [
        {
          id: 'cv-l4-transfer-learning',
          title: 'Transfer Learning & Data Augmentation',
          description: 'Leveraging pretrained feature hierarchies, freezing early layers, and fine-tuning custom heads.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Replace and train a custom classification head on a pretrained ResNet-50 backbone.',
          explanation: 'Early CNN layers learn universal low-level visual primitives (Gabor-like edges, color gradients), while mid-layers learn textures and shapes. Transfer learning freezes these universal layers and fine-tunes only task-specific heads.',
          importantConcepts: [
            'Pretrained Weights: Models trained on 14+ million ImageNet photos.',
            'Feature Freezing: Setting param.requires_grad = False on early layers.',
            'Data Augmentation: Random rotations, color jitter, and horizontal flips to prevent overfitting.'
          ],
          keyPoints: [
            'Always match the preprocessing normalization values used during original ImageNet pretraining.',
            'Fine-tune with a substantially smaller learning rate (e.g. 1e-4 or 1e-5) to avoid catastrophic forgetting.'
          ],
          codeExample: {
            language: 'python',
            code: `# Transfer Learning Architecture Setup in PyTorch:\n# model = torchvision.models.resnet50(pretrained=True)\n# for param in model.parameters(): param.requires_grad = False\n# model.fc = nn.Linear(model.fc.in_features, num_classes=5)\nprint("ResNet-50 backbone frozen. Custom 5-class head attached.")`,
            explanation: 'Freezing feature extractor and replacing classification head.',
            output: 'ResNet-50 backbone frozen. Custom 5-class head attached.'
          },
          practicalExample: {
            title: 'Skin Lesion Classifier',
            scenario: 'You only have 500 medical photos of rare lesions. How to achieve high accuracy?',
            solution: 'Transfer learning from ImageNet with heavy domain-specific data augmentation.'
          },
          quiz: {
            question: 'What is the risk of training all layers of a deep pretrained model with a large learning rate on a small dataset?',
            options: [
              'Catastrophic forgetting of pretrained weights',
              'The image channels invert',
              'Loss becomes negative',
              'Image resolution drops'
            ],
            correctIndex: 0,
            explanation: 'Large weight updates destroy the rich general feature extractors learned from millions of images.'
          },
          practiceChallenge: {
            prompt: 'Write the code snippet to freeze all parameters in a PyTorch model.',
            starterCode: 'def freeze_model(model):\n    pass',
            solutionHint: 'Loop through model.parameters() and set requires_grad = False.',
            solutionCode: 'def freeze_model(model):\n    for param in model.parameters():\n        param.requires_grad = False'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'cv-m5',
      moduleNumber: 5,
      title: 'Object Detection & Localization',
      description: 'Bounding box regression, Intersection over Union (IoU), Non-Maximum Suppression (NMS), Anchor boxes, and YOLO.',
      difficulty: 'Advanced',
      estimatedMinutes: 150,
      xpReward: 300,
      lessons: [
        {
          id: 'cv-l5-yolo',
          title: 'You Only Look Once (YOLO) Architecture',
          description: 'Single-stage grid predictions, anchor priors, confidence scores, and fast NMS postprocessing.',
          estimatedMinutes: 35,
          xpReward: 25,
          learningObjective: 'Calculate Intersection over Union (IoU) and parse YOLO detection output tensors.',
          explanation: 'While classical approaches used sliding windows, YOLO divides the image into a grid. Each grid cell predicts bounding boxes, confidence scores, and class probabilities simultaneously in a single forward pass at 60+ FPS.',
          importantConcepts: [
            'Bounding Box Coordinates: [center_x, center_y, width, height] normalized between 0 and 1.',
            'Intersection over Union (IoU): Area of overlap divided by area of union between two boxes.',
            'Non-Maximum Suppression (NMS): Pruning redundant overlapping bounding boxes for the same object.'
          ],
          keyPoints: [
            'IoU threshold of 0.5 or 0.7 determines whether a prediction counts as a True Positive (mAP@50).',
            'Single-stage detectors (YOLO) are optimized for real-time inference, whereas two-stage (Faster R-CNN) prioritize maximum precision.'
          ],
          codeExample: {
            language: 'python',
            code: `def calculate_iou(boxA, boxB):\n    # box = [x1, y1, x2, y2]\n    xA = max(boxA[0], boxB[0])\n    yA = max(boxA[1], boxB[1])\n    xB = min(boxA[2], boxB[2])\n    yB = min(boxA[3], boxB[3])\n    inter_area = max(0, xB - xA) * max(0, yB - yA)\n    boxA_area = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])\n    boxB_area = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])\n    return inter_area / float(boxA_area + boxB_area - inter_area)\n\niou = calculate_iou([10, 10, 50, 50], [20, 20, 60, 60])\nprint(f"Intersection over Union (IoU): {iou:.3f}")`,
            explanation: 'Calculating the geometric IoU overlap between two bounding boxes.',
            output: 'Intersection over Union (IoU): 0.391'
          },
          practicalExample: {
            title: 'Autonomous Vehicle Pedestrian Detection',
            scenario: 'Detect and track moving pedestrians across a 4K highway camera feed in real time.',
            solution: 'Deploy YOLOv8 nano/small model quantized to TensorRT INT8 for sub-10ms latency.'
          },
          quiz: {
            question: 'What does an IoU score of 1.0 signify between two bounding boxes?',
            options: [
              'Zero overlap',
              'The boxes have identical coordinates and overlap perfectly',
              'One box is twice the size of the other',
              'The model confidence is 100%'
            ],
            correctIndex: 1,
            explanation: 'When intersection equals union, the predicted box and ground truth box are geometrically identical.'
          },
          practiceChallenge: {
            prompt: 'Calculate the area of a bounding box defined as [x1=15, y1=20, x2=65, y2=80].',
            starterCode: 'box = [15, 20, 65, 80]\n# area = ?',
            solutionHint: 'width = x2 - x1; height = y2 - y1; area = width * height',
            solutionCode: 'width = 65 - 15 # 50\nheight = 80 - 20 # 60\narea = width * height\nprint(f"Area: {area}") # 3000'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'cv-m6',
      moduleNumber: 6,
      title: 'Image Segmentation & U-Net',
      description: 'Pixel-level classification, encoder-decoder networks, skip connections, Dice loss, and Mask R-CNN.',
      difficulty: 'Advanced',
      estimatedMinutes: 130,
      xpReward: 250,
      lessons: [
        {
          id: 'cv-l6-segmentation',
          title: 'Semantic Segmentation & U-Net Architectures',
          description: 'Classifying every single pixel in an image with symmetric contracting and expanding paths.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Explain how U-Net skip connections preserve fine spatial resolution for pixel masks.',
          explanation: 'While classification gives a single label and detection gives boxes, segmentation generates a pixel mask indicating exact boundaries. U-Net bridges high-level semantic context with low-level spatial detail using lateral skip connections.',
          importantConcepts: [
            'Semantic vs Instance: Semantic groups all instances of "car" under one label; Instance separates individual car IDs.',
            'Dice Coefficient / IoU Loss: Overcoming extreme background vs foreground pixel class imbalance.',
            'Transposed Convolutions / Bilinear Upsampling: Expanding feature maps back to original image resolution.'
          ],
          keyPoints: [
            'Cross-entropy loss alone fails in segmentation because background pixels outnumber foreground pixels 100:1.',
            'U-Net is universally used in biomedical imaging and satellite land-cover mapping.'
          ],
          codeExample: {
            language: 'python',
            code: `def dice_coefficient(y_true, y_pred, smooth=1e-6):\n    intersection = np.sum(y_true * y_pred)\n    return (2. * intersection + smooth) / (np.sum(y_true) + np.sum(y_pred) + smooth)\n\nmask_true = np.array([0, 1, 1, 0, 1])\nmask_pred = np.array([0, 1, 0, 0, 1])\nprint("Dice Score:", round(dice_coefficient(mask_true, mask_pred), 3))`,
            explanation: 'Calculating the Dice Coefficient between binary target and predicted segmentation masks.',
            output: 'Dice Score: 0.8'
          },
          practicalExample: {
            title: 'Tumor Boundary Extraction',
            scenario: 'Segment exact millimeter boundaries of brain tumors from MRI scans.',
            solution: 'Train 3D U-Net using soft Dice loss combined with Focal Loss.'
          },
          quiz: {
            question: 'What is the primary function of skip connections between the encoder and decoder in U-Net?',
            options: [
              'To reduce file size on disk',
              'To transfer high-resolution spatial feature details directly to the upsampling layers',
              'To convert color images to grayscale',
              'To make the network linear'
            ],
            correctIndex: 1,
            explanation: 'Downsampling in the encoder loses precise spatial coordinates; skip connections reintroduce these coordinates to guide exact boundary reconstruction.'
          },
          practiceChallenge: {
            prompt: 'Calculate the Dice loss (1 - Dice Coefficient) when the Dice score is 0.88.',
            starterCode: 'dice_score = 0.88\n# dice_loss = ?',
            solutionHint: 'Dice loss is 1.0 minus Dice score.',
            solutionCode: 'dice_loss = 1.0 - 0.88\nprint(f"Dice Loss: {dice_loss:.2f}") # 0.12'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'cv-m7',
      moduleNumber: 7,
      title: 'Computer Vision Capstone Project',
      description: 'End-to-end milestone: build a real-time object detection and tracking pipeline with OpenCV and PyTorch.',
      difficulty: 'Advanced',
      estimatedMinutes: 180,
      xpReward: 350,
      project: {
        title: 'Real-Time Edge Detection & Tracking System',
        description: 'Implement a real-time video stream analyzer that detects objects, renders glowing HUD bounding boxes, tracks velocities, and outputs FPS telemetry.',
        xpReward: 350
      },
      lessons: [
        {
          id: 'cv-l7-capstone',
          title: 'Real-Time Video Pipelines & Inference Optimization',
          description: 'Frame threading, FPS calculation, non-blocking video I/O, and annotated visual HUD overlays.',
          estimatedMinutes: 30,
          xpReward: 25,
          learningObjective: 'Construct a 60+ FPS multi-threaded video inference loop.',
          explanation: 'Running inference in the main capture loop stalls camera frame acquisition. Professional vision engineers decouple frame capture into dedicated worker threads, buffering frames for model inference.',
          importantConcepts: [
            'Threaded Video Capture: Eliminating camera buffer lag with Python threading.',
            'Batch Frame Processing: Grouping sequential video frames for batch GPU inference.',
            'Annotated HUD Overlays: Drawing glowing bounding boxes, labels, and latency metrics.'
          ],
          keyPoints: [
            'Never call expensive disk writes or synchronized waits inside real-time camera loops.',
            'Measure both pre-processing, inference, and post-processing latency separately to identify bottlenecks.'
          ],
          codeExample: {
            language: 'python',
            code: `# Video Processing Pipeline Architecture:\n# cap = cv2.VideoCapture(0)\n# while cap.isOpened():\n#     ret, frame = cap.read()\n#     results = model.predict(frame, conf=0.5)\n#     annotated = results[0].plot()\n#     cv2.imshow("AI Vision Stream", annotated)\nprint("Computer Vision Real-Time Pipeline operational.")`,
            explanation: 'High-speed camera streaming loop with live inference overlay.',
            output: 'Computer Vision Real-Time Pipeline operational.'
          },
          practicalExample: {
            title: 'FPS Counter Implementation',
            scenario: 'Compute smooth moving-average frames per second.',
            solution: 'fps = 1.0 / (time.time() - prev_time)'
          },
          quiz: {
            question: 'What is the most common cause of camera feed stuttering during computer vision inference?',
            options: [
              'The monitor refresh rate is too high',
              'Running slow model inference synchronously on the same thread that acquires video frames',
              'Having too many colors in the image',
              'Using OpenCV instead of PIL'
            ],
            correctIndex: 1,
            explanation: 'Blocking the frame acquisition thread causes the camera buffer to overflow, dropping frames and introducing severe latency.'
          },
          practiceChallenge: {
            prompt: 'Celebrate your completion of Computer Vision and prepare for Natural Language Processing!',
            starterCode: '# Verify complete vision stack',
            solutionHint: 'Confirm mastery from pixels and filters to YOLO and segmentation.',
            solutionCode: 'print("Computer Vision Realm Mastered! Ready for Natural Language Processing.")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    }
  ]
};
