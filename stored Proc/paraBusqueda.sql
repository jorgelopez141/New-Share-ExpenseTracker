ALTER PROCEDURE UnStProc @CatGasto nvarchar(150), @CatEspecifica nvarchar(250)
AS

/*Dado que cat especifica sea null*/
if isnull(@CatEspecifica,'chungaraCharachungara') = 'chungaraCharachungara' OR LEN(@CatEspecifica) <2 
begin 
	SELECT * FROM Situacion_Financiera.dbo.tGastosFoto WHERE cat_gasto = @CatGasto
end 

/*dado que cat general no sea null y tampoco cat especifico*/
else if (isnull(@CatGasto,'chungaraCharachungara') <> 'chungaraCharachungara' OR LEN(@CatGasto) < 2) 
AND isnull(@CatEspecifica,'chungaraCharachungara') <> 'chungaraCharachungara' 

begin 
	SELECT * FROM Situacion_Financiera.dbo.tGastosFoto WHERE cat_gasto = @CatGasto
	and cat_especifica = @CatEspecifica
end

else 
/* dado que Cat General es Null y Cat Especifica no lo es*/
SELECT * FROM Situacion_Financiera.dbo.tGastosFoto WHERE  cat_especifica = @CatEspecifica


GO

UnStProc 'Supermercado','leche'


