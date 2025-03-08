-- QUERY 1
WITH AliasItems AS (
    SELECT
        cu.id as customerID,
        cu.name as customerName,
        cu.nif as customerNIF,
        cu.currency as customerDefCurrency,
        cu.currency_iso as customerDefCurrencyISO,
        cu.description as customerDescription,
        cu.phone as customerPhone,
        cu.email as customerEmail,
        cu.industry as customerIndustry,
        cu.owner_id as ownerID,
        cu.created_at as customerCreatedAt,
        cu.updated_at as customerUpdatedAt,
        cu.deleted_at as customerDeletedAt,
        o.name as ownerName,
        o.description as ownerDescription,
        o.phone as ownerPhone,
        o.fax as ownerFax,
        o.nif as ownerNIF,
        o.email as ownerEmail,
        ca.id as customerAddressID,
        ca.email as customerAddressEmail,
        ca.fax as customerAddressFax,
        ca.group_code as customerAddressGroupCode,
        ca.phone as customerAddressPhone,
        ca.postal_code as customerAddressCP,
        ca.street as customerAddressStreet,
        ca.type as customerAddressType,
        c.id as cityID,
        c.name as cityName,
        s.id as stateID,
        s.name as stateName,
        c2.id as countryID,
        c2.code as countryCode,
        c2.name as countryName,
        tms.tms_id as tmsID,
        tms.tms_name as tmsCustomerName
    FROM MASTER.customers cu
    left join MASTER.owners o on o.id = cu.owner_id
    left join MASTER.customer_addresses ca on cu.id = ca.customer_id
    left join MASTER.cities c on c.id = ca.city_id
    left join MASTER.states s on s.id = ca.state_id
    left join MASTER.countries c2 on c2.id = ca.country_id
    left join MASTER.customers_tms tms on tms.customer_id = cu.id
),
FilteredItems AS (
    SELECT
    *
    FROM AliasItems
    WHERE 1=1
),
IncludedItems AS (
    SELECT
    customerID,
    ROW_NUMBER() OVER (ORDER BY customerName asc) as rn
    FROM FilteredItems
),
FilteredRows AS (
    SELECT customerID
    FROM IncludedItems
    WHERE rn BETWEEN 0 AND 50
),
TotalItems AS (
    SELECT COUNT(DISTINCT customerID) as total FROM FilteredItems
)
select
    ai.*,
    (SELECT total FROM TotalItems) as total
FROM AliasItems ai
INNER JOIN FilteredRows fr on fr.customerID = ai.customerID
ORDER BY ai.customerName asc;


-- QUERY 2
WITH AliasItems AS (
    SELECT
        cu.id as customerID,
        cu.name as customerName,
        cu.nif as customerNIF,
        cu.currency as customerDefCurrency,
        cu.currency_iso as customerDefCurrencyISO,
        cu.description as customerDescription,
        cu.phone as customerPhone,
        cu.email as customerEmail,
        cu.industry as customerIndustry,
        cu.owner_id as ownerID,
        cu.created_at as customerCreatedAt,
        cu.updated_at as customerUpdatedAt,
        cu.deleted_at as customerDeletedAt,
        o.name as ownerName,
        o.description as ownerDescription,
        o.phone as ownerPhone,
        o.fax as ownerFax,
        o.nif as ownerNIF,
        o.email as ownerEmail,
        ca.id as customerAddressID,
        ca.email as customerAddressEmail,
        ca.fax as customerAddressFax,
        ca.group_code as customerAddressGroupCode,
        ca.phone as customerAddressPhone,
        ca.postal_code as customerAddressCP,
        ca.street as customerAddressStreet,
        ca.type as customerAddressType,
        c.id as cityID,
        c.name as cityName,
        s.id as stateID,
        s.name as stateName,
        c2.id as countryID,
        c2.code as countryCode,
        c2.name as countryName,
        tms.tms_id as tmsID,
        tms.tms_name as tmsCustomerName,
        sga.sga_id as sgaID,
        sga.sga_name as sgaCustomerName,
        w.id as warehouseID,
        w.name as warehouseName,
        w.description as warehouseDescription,
        w.street as warehouseStreet,
        w.phone as warehousePhone,
        w.fax as warehouseFax,
        w.email as warehouseEmail,
        w.city_id as warehouseCityID,
        c3.name as warehouseCityName,
        w.state_id as warehouseStateID,
        s2.name as warehouseStateName,
        w.country_id as warehouseCountryID,
        c4.code as warehouseCountryCode,
        c4.name as warehouseCountryName
    FROM MASTER.customers cu
    left join MASTER.owners o on o.id = cu.owner_id
    left join MASTER.customer_addresses ca on cu.id = ca.customer_id
    left join MASTER.cities c on c.id = ca.city_id
    left join MASTER.states s on s.id = ca.state_id
    left join MASTER.countries c2 on c2.id = ca.country_id
    left join MASTER.customers_tms tms on tms.customer_id = cu.id
    left join MASTER.customers_sga sga on sga.customer_id = cu.id
    left join MASTER.warehouses w on w.id = sga.warehouse_id
    left join MASTER.cities c3 on c3.id = w.city_id
    left join MASTER.states s2 on s2.id = w.state_id
    left join MASTER.countries c4 on c4.id = w.country_id
),
FilteredItems AS (
    SELECT
    *
    FROM AliasItems
    WHERE 1=1
),
IncludedItems AS (
    SELECT
    customerID,
    ROW_NUMBER() OVER (ORDER BY customerName asc) as rn
    FROM FilteredItems
),
FilteredRows AS (
    SELECT customerID
    FROM IncludedItems
    WHERE rn BETWEEN 0 AND 50
),
TotalItems AS (
    SELECT COUNT(DISTINCT customerID) as total FROM FilteredItems
)
select
    ai.*,
    (SELECT total FROM TotalItems) as total
FROM AliasItems ai
INNER JOIN FilteredRows fr on fr.customerID = ai.customerID
ORDER BY ai.customerName asc;
