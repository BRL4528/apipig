export default interface ICreateScoreDTO {
  quantity: number;
  weight: string;
  type: string;
  nfe: string;
  name?: string;
  lote?: string;
  start_date: Date;
  end_date: Date;
  producer_id_sender?: string;
  farm_id_sender?: string;
  producer_id_received?: string;
  farm_id_received?: string;
  producer_id_internal?: string;
  farm_id_internal?: string;
}
