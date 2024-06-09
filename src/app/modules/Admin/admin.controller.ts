import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { adminServices } from './admin.service';

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await adminServices.getAllAdminsFromDB();
  sendResponse(res, {
    message: 'Retrieved admins successfully',
    success: true,
    data: result,
    statusCode: 201,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.getSingleAdminFromDB(id);
  sendResponse(res, {
    message: 'Retrieved admin successfully',
    success: true,
    data: result,
    statusCode: 200,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await adminServices.updateAdminIntoDB(id, updateData);
  sendResponse(res, {
    message: 'Updated admin successfully',
    success: true,
    data: result,
    statusCode: 200,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.deleteAdminFromDB(id);
  sendResponse(res, {
    message: 'Deleted admin successfully',
    success: true,
    data: result,
    statusCode: 200,
  });
});

export const adminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
