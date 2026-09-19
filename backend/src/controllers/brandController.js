const Brand = require('../models/Brand');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');

const mockBrands = [];

exports.getBrands = async (req, res) => {
  try {
    const userId = req.user.id;
    const { useMockStore } = getDBStatus();

    if (useMockStore) {
      const userBrands = mockBrands.filter(b => b.user === userId);
      return res.json({ brands: userBrands });
    }

    const brands = await Brand.find({ user: userId }).sort({ createdAt: -1 });
    return res.json({ brands });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch brand profiles', error: error.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { useMockStore } = getDBStatus();

    if (useMockStore) {
      const brand = mockBrands.find(b => b._id === id && b.user === userId);
      if (!brand) return res.status(404).json({ message: 'Brand profile not found or unauthorized' });
      return res.json({ brand });
    }

    const brand = await Brand.findOne({ _id: id, user: userId });
    if (!brand) return res.status(404).json({ message: 'Brand profile not found or unauthorized' });
    return res.json({ brand });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch brand profile' });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const userId = req.user.id;
    const { brandName, name, industry, targetAudience, tone, postingGoals, goals, platforms, keywords, description, website } = req.body;

    const finalBrandName = brandName || name;
    if (!finalBrandName) {
      return res.status(400).json({ message: 'brandName is required' });
    }

    const finalGoals = postingGoals || goals || 'Brand growth & engagement';
    const { useMockStore } = getDBStatus();

    if (useMockStore) {
      const newBrand = {
        _id: 'mock_brand_' + Date.now(),
        user: userId,
        brandName: finalBrandName,
        name: finalBrandName,
        industry: industry || 'General',
        targetAudience: targetAudience || 'General Audience',
        tone: tone || 'Professional',
        postingGoals: finalGoals,
        platforms: Array.isArray(platforms) && platforms.length ? platforms : ['Instagram', 'LinkedIn', 'X'],
        keywords: Array.isArray(keywords) ? keywords : (typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : []),
        description: description || '',
        website: website || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockBrands.push(newBrand);
      return res.status(201).json({ message: 'Brand profile created', brand: newBrand });
    }

    const formattedKeywords = Array.isArray(keywords)
      ? keywords
      : typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()).filter(Boolean) : [];

    const brand = await Brand.create({
      user: userId,
      brandName: finalBrandName,
      industry: industry || 'General',
      targetAudience: targetAudience || 'General Audience',
      tone: tone || 'Professional',
      postingGoals: finalGoals,
      platforms: Array.isArray(platforms) && platforms.length ? platforms : ['Instagram', 'LinkedIn', 'X'],
      keywords: formattedKeywords,
      description: description || '',
      website: website || '',
    });

    await User.findByIdAndUpdate(userId, { activeBrandId: brand._id });

    return res.status(201).json({ message: 'Brand profile created successfully', brand });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create brand profile', error: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { brandName, name, industry, targetAudience, tone, postingGoals, goals, platforms, keywords, description, website } = req.body;

    const { useMockStore } = getDBStatus();

    const finalBrandName = brandName || name;
    const finalGoals = postingGoals || goals;

    if (useMockStore) {
      const index = mockBrands.findIndex(b => b._id === id && b.user === userId);
      if (index === -1) return res.status(404).json({ message: 'Brand profile not found or unauthorized' });

      mockBrands[index] = {
        ...mockBrands[index],
        brandName: finalBrandName || mockBrands[index].brandName,
        name: finalBrandName || mockBrands[index].name,
        industry: industry || mockBrands[index].industry,
        targetAudience: targetAudience || mockBrands[index].targetAudience,
        tone: tone || mockBrands[index].tone,
        postingGoals: finalGoals || mockBrands[index].postingGoals,
        platforms: Array.isArray(platforms) ? platforms : mockBrands[index].platforms,
        keywords: Array.isArray(keywords) ? keywords : mockBrands[index].keywords,
        description: description !== undefined ? description : mockBrands[index].description,
        website: website !== undefined ? website : mockBrands[index].website,
        updatedAt: new Date(),
      };
      return res.json({ message: 'Brand profile updated', brand: mockBrands[index] });
    }

    const updateData = {};
    if (finalBrandName) updateData.brandName = finalBrandName;
    if (industry !== undefined) updateData.industry = industry;
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience;
    if (tone !== undefined) updateData.tone = tone;
    if (finalGoals !== undefined) updateData.postingGoals = finalGoals;
    if (platforms !== undefined) updateData.platforms = platforms;
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;

    if (keywords !== undefined) {
      updateData.keywords = Array.isArray(keywords)
        ? keywords
        : typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
    }

    const brand = await Brand.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!brand) return res.status(404).json({ message: 'Brand profile not found or unauthorized' });

    return res.json({ message: 'Brand profile updated successfully', brand });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update brand profile', error: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { useMockStore } = getDBStatus();

    if (useMockStore) {
      const index = mockBrands.findIndex(b => b._id === id && b.user === userId);
      if (index === -1) return res.status(404).json({ message: 'Brand profile not found or unauthorized' });
      mockBrands.splice(index, 1);
      return res.json({ message: 'Brand profile deleted successfully' });
    }

    const brand = await Brand.findOneAndDelete({ _id: id, user: userId });
    if (!brand) return res.status(404).json({ message: 'Brand profile not found or unauthorized' });

    return res.json({ message: 'Brand profile deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete brand profile' });
  }
};

exports.mockBrands = mockBrands;
