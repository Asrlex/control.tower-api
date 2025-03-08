/**
 * Interface representing a generic repository for managing entities.
 * @template T - The type of the entity.
 * @template ID - The type of the entity's identifier.
 */
export interface GenericRepository<T, ID, CreateDto> {
  /**
   * Retrieves all entities.
   * @returns {Promise<{ entities: T[]; total: number }>} A promise that resolves to an object containing the entities and the total number of entities.
   */
  findAll(): Promise<{ entities: T[]; total: number }>;

  /**
   * Retrieves entities that match the search criteria.
   * @param {number} page - The page number.
   * @param {number} limit - The maximum number of entities to retrieve.
   * @param {any} searchCriteria - The search criteria.
   * @returns {Promise<{ entities: T[]; total: number }>} A promise that resolves to an object containing the entities and the total number of entities.
   */
  find(
    page: number,
    limit: number,
    searchCriteria: any,
  ): Promise<{ entities: T[]; total: number }>;

  /**
   * Retrieves an entity by its identifier.
   * @param {ID} id - The identifier of the entity.
   * @returns {Promise<T | null>} A promise that resolves to the entity, or null if not found.
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Creates a new entity.
   * @param {T} dto - The entity to create.
   * @param {ID} id - The identifier of the entity to which the new entity is related.
   * @returns {Promise<T>} A promise that resolves to the created entity.
   */
  create(dto: CreateDto, id?: ID): Promise<T>;

  /**
   * Modifies an existing entity.
   * @param {ID} id - The identifier of the entity to modify.
   * @param {T} dto - The modified entity.
   * @returns {Promise<T>} A promise that resolves to the modified entity.
   */
  modify(id: ID, dto: CreateDto): Promise<T | null>;

  /**
   * Deletes an entity by its identifier.
   * @param {ID} id - The identifier of the entity to delete.
   * @returns {Promise<void>} A promise that resolves when the entity is deleted.
   */
  delete(id: ID): Promise<void>;
}
