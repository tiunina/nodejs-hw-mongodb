import ContactCollection from '../db/models/Contacts.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;
  const contactsQuery = ContactCollection.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const total = await ContactCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const items = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calcPaginationData({ total, page, perPage });
  return {
    items,
    ...paginationData,
  };
};
export const getContactById = (id) => ContactCollection.findById(id);
export const addContact = (payload) => ContactCollection.create(payload);
export const updateContact = async (_id, payload, options = {}) => {
  const { upsert } = options;
  const result = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    upsert,
    includeResultMetadata: true,
  });
  if (!result || !result.value) return null;

  const isNew = Boolean(result.lastErrorObject.upserted);

  return { isNew, data: result.value };
};

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
