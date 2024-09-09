import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, LinearProgress, Box, TextField, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/material/styles';
import './Form.css';

const UploadCard = styled(Card)(({ theme }) => ({
  border: '2px dashed #ccc',
  textAlign: 'center',
  padding: 0,
  cursor: 'pointer',
  position: 'relative',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: '#888',
  },
}));

const Form = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isOrganic, setIsOrganic] = useState(false);
  const [moisture, setMoisture] = useState('');
  const [shelfLife, setShelfLife] = useState('');
  const [units, setUnits] = useState('');
  const [validity, setValidity] = useState('');
  const [packages, setPackages] = useState([{ type: '', quantity: '' }]);
  const [pricePerKgOrTon, setPricePerKgOrTon] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsUploading(true);
      setProgress(0);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return Math.min(oldProgress + 10, 100);
        });
      }, 500);
    }
  }, [isUploading]);

  const handleCardClick = () => {
    if (!selectedImage) {
      document.getElementById('imageInput').click();
    }
  };

  const handleOrganicChange = (event) => {
    setIsOrganic(event.target.checked);
  };

  const handleMoistureChange = (event) => {
    setMoisture(event.target.value);
  };

  const handleUnitsChange = (event) => {
    setUnits(event.target.value);
    calculateTotalAmount();
  };

  const handleShelfLifeChange = (event) => {
    setShelfLife(event.target.value);
  };

  const handleValidityChange = (event) => {
    setValidity(event.target.value);
  };

  const handlePackageTypeChange = (index, event) => {
    const newPackages = [...packages];
    newPackages[index].type = event.target.value;
    setPackages(newPackages);
  };

  const handlePackageQuantityChange = (index, event) => {
    const newPackages = [...packages];
    newPackages[index].quantity = event.target.value;
    setPackages(newPackages);
    calculateTotalAmount();
  };

  const addPackageField = () => {
    setPackages([...packages, { type: '', quantity: '' }]);
  };

  const removePackageField = (index) => {
    const newPackages = packages.filter((_, i) => i !== index);
    setPackages(newPackages);
  };
  const calculateTotalAmount = () => {
    if (pricePerKgOrTon && units && packages.length) {
      const totalQuantity = packages.reduce((acc, pkg) => acc + parseFloat(pkg.quantity || 0), 0);
      const multiplier = units === 'kg' ? 1 : 1000; // Convert tons to kg if necessary
      const total = pricePerKgOrTon * totalQuantity * multiplier;
      setTotalAmount(total);
    }
  };
  useEffect(calculateTotalAmount, [pricePerKgOrTon, packages, units])

  const handlePriceChange = (event) => {
    setPricePerKgOrTon(event.target.value);
    calculateTotalAmount(); // Recalculate when pricing changes
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const packageDict = packages.reduce((acc, pkg) => {
      if (pkg.type && pkg.quantity) {
        acc[pkg.type] = pkg.quantity;
      }
      return acc;
    }, {});

    const formData = {
      image: selectedImage,
      isOrganic,
      moisture,
      shelfLife,
      units,
      validity,
      packages: packageDict,
      description: event.target.description.value,
      pricePerKgOrTon,
      totalAmount
    };

    console.log('Form Data:', formData);
  };

  return (
    <div className='formContainer'>
      <Card 
        sx={{
          margin: ' 30px 20px'
        }}
      >
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            Your one-stop shop for premium quality pulses. Discover a wide variety of wholesome, nutritious pulses for all your cooking needs.
          </Typography>
        </CardContent>
      </Card>

      <Card 
        sx={{ 
          maxWidth: '100%', 
          margin: '20px auto', 
          mt: 5, 
          padding: 2, 
          '@media (max-width: 360px)': { 
            maxWidth: '100%', 
            margin: 'auto', 
            boxShadow: 'none' 
          } 
        }}
      >
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" sx={{ marginBottom: 5 }}>
              Product Details Form
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 5, alignItems: 'center', gap: 3 }}>
              <UploadCard
                sx={{ width: 120, height: 120, textAlign: 'center', position: 'relative' }}
                onClick={handleCardClick}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="imageInput"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                {selectedImage && !isUploading ? (
                  <CardMedia
                    component="img"
                    image={selectedImage}
                    alt="Uploaded"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <IconButton color="primary">
                      <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
                    </IconButton>                    
                    {isUploading ? (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{margin: '10px auto 6px'}}>
                          Uploading....
                        </Typography>
                        <Box sx={{ width: 120, textAlign: 'center' }}>
                          <LinearProgress variant="determinate" value={progress} />
                        </Box>
                      </>
                    ):
                    <Typography variant="body2" color="text.secondary">
                      Upload Image
                    </Typography>}
                  </CardContent>
                )}
              {selectedImage && !isUploading && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: 'red',
                    color: 'white',
                    fontSize: '14px',
                    padding: '4px',
                    '&:hover': {
                      backgroundColor: 'darkred',
                    },
                  }}
                  onClick={handleRemoveImage}
                >
                  <CloseIcon fontSize="5px" />
                </IconButton>
              )}
              </UploadCard>
				{/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Button
						variant="contained"
						color="primary"
						sx={{ whiteSpace: 'nowrap' }} // Prevent text wrap
						onClick={() => {
							navigator.mediaDevices.getUserMedia({ audio: true })
							.then(stream => {
								console.log("Audio permission granted.");
							})
							.catch(err => {
								console.log("Audio permission denied.", err);
							});
						}}
					>
						Audio Permission
					</Button>
					<Button
						variant="contained"
						color="primary"
						sx={{ whiteSpace: 'nowrap' }} // Prevent text wrap
						onClick={() => {
							navigator.mediaDevices.getUserMedia({ video: true })
							.then(stream => {
								console.log("Video permission granted.");
							})
							.catch(err => {
								console.log("Video permission denied.", err);
							});
						}}
					>
						Video Permission
					</Button>
				</Box> */}
            </Box>
				{/* Buttons side-by-side */}
            <TextField
              label="Product Name"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              required
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <TextField
                label="Pricing per Kg"
                variant="outlined"
                type="number"
                sx={{ flex: 1, marginRight: 1 }}
                value={pricePerKgOrTon}
                onChange={handlePriceChange}
                required
              />
              <FormControl sx={{ flex: 1, marginLeft: 1 }}>
                <InputLabel>Units</InputLabel>
                <Select
                  value={units}
                  label="Units"
                  onChange={handleUnitsChange}
                  required
                >
                  <MenuItem value="kg">1 Kg</MenuItem>
                  <MenuItem value="ton">1 Ton</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOrganic}
                  onChange={handleOrganicChange}
                />
              }
              label="Is Organic?"
              sx={{ marginBottom: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Moisture</InputLabel>
                <Select
                  value={moisture}
                  label="Moisture"
                  onChange={handleMoistureChange}
                  required
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Shelf Life</InputLabel>
                <Select
                  value={shelfLife}
                  label="Shelf Life"
                  onChange={handleShelfLifeChange}
                  required
                >
                  <MenuItem value="1 month">1 month</MenuItem>
                  <MenuItem value="3 months">3 months</MenuItem>
                  <MenuItem value="6 months">6 months</MenuItem>
                  <MenuItem value="1 year">1 year</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              label="Validity"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ marginBottom: 2 }}
              value={validity}
              onChange={handleValidityChange}
              required
            />
            
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              name="description"
              required
            />
            
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6" gutterBottom>
                Package
              </Typography>
              {packages.map((pkg, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                  <FormControl sx={{ flex: 1, marginRight: 1 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={pkg.type}
                      label="Type"
                      onChange={(event) => handlePackageTypeChange(index, event)}
                      required
                    >
                      <MenuItem value="unpacked">Unpacked</MenuItem>
                      <MenuItem value="1kg packed">1kg Packed</MenuItem>
                      <MenuItem value="5kg packed">5kg Packed</MenuItem>
                      <MenuItem value="25kg packed">25kg Packed</MenuItem>
                      <MenuItem value="50kg packed">50kg Packed</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="h6" sx={{ marginX: 1 }}> - </Typography>
                  <FormControl sx={{ flex: 1 }}>
                    <TextField
                      label="Quantity"
                      variant="outlined"
                      type="number"
                      sx={{ flex: 1, marginRight: 1 }}
                      value={pkg.quantity}
                      onChange={(event) => handlePackageQuantityChange(index, event)}
                      required
                    />
                  </FormControl>
                  <IconButton
                    sx={{
                      marginLeft: 2,
                      padding: '2px',
                      backgroundColor: 'rgba(255, 0, 0, 0.3)',
                      color: 'rgba(255, 0, 0, 0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                      },
                    }}
                    onClick={() => removePackageField(index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <IconButton
                sx={{
                  marginTop: 2,
                  backgroundColor: 'blue',
                  color: 'white',
                  fontSize: '14px',
                  borderRadius: '5px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 255, 0.5)',
                    color: 'white'
                  },
                }}
                onClick={addPackageField}
              >
                <AddIcon /> Add Package
              </IconButton>
            </Box>
            {/* Calculated Total */}
            <Box sx={{ display: 'flex', alignItems: 'end', flexDirection: 'column', fontSize: '16px'}}>
              <Typography sx={{ flex: 1, fontWeight: 'bold' }}>
                Total Amount: 
              </Typography>
              <Typography sx={{ flex: 1 }}>
                {totalAmount} Rs
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                Submit
              </Button>
            </Box>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default Form;
